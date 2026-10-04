# BigQuery Query Guard

A small JavaScript query boundary for applications using BigQuery: **authorize → cache → dry run → engine-enforced byte limit → trace**.

A standalone adaptation of patterns used at [Bakiano](https://bakiano.com), with explicit cache scopes, publication versioning, in-flight reuse and honest billing metadata.

**[Try the demo](#try-it-without-gcp) · [Integration](#connect-your-own-bigquery-project) · [Design](docs/architecture.md) · [Guarantees](docs/guarantees.md)**

The default demo is a **BigQuery scan lab**: compare reviewed SQL variants, recorded scan estimates, output schemas, and a per-query byte cap. The cache and authorization sandbox remains available at `/guard`.

![Three selected columns retain the required fields while reducing the recorded scan estimate.](docs/images/scan-lab.jpg)

## Try it without GCP

Node.js 22 or newer. No dependency installation or cloud credentials required.

```sh
git clone https://github.com/alejandrofrank/bigquery-query-guard.git
cd bigquery-query-guard
npm run dev
```

Open **http://127.0.0.1:4312**.

Switch between five experiments. Each choice displays the exact SQL, bytes BigQuery estimated, and the resulting schema. The page reads bundled measurements; it sends no Google Cloud requests and cannot run arbitrary SQL.

| Experiment | Recorded observation | What changes |
| --- | --- | --- |
| `LIMIT 100` → `LIMIT 10` | Both estimate 7,487,651,196 bytes | Fewer returned rows; same scan |
| `SELECT *` → three columns | 7,487,651,196 → 978,926,553 bytes | Required fields stay; other fields disappear |
| Date filter on the taxi table | Both estimate 978,926,553 bytes | Narrower answer; no scan reduction |
| Time slice on the Bitcoin view | 130,686,374,250 → 169,415,050 bytes | One day instead of all history |
| Count transactions → sum block counts | 27,659,600 → 23,274,984 bytes | Same verified count, less detail available |

Measurements were recorded on **2026-10-04** using public datasets. The two aggregate queries both returned **657,752** transactions for 2024-01-01 UTC. These numbers are **scan estimates**, not latency benchmarks or dollar savings. Exact queries, output schemas, timestamps, and observed aggregate billing metadata are committed in [`data/query-estimates.js`](data/query-estimates.js). [Evidence and reproduction](docs/scan-lab.md).

The byte-cap control invokes the **real guard library** with a local adapter. A blocked estimate never reaches that adapter's execution method. An allowed request still does not execute BigQuery, and its billed bytes remain unknown.

At **http://127.0.0.1:4312/guard**, run a simulated query, repeat it, request it from instance B, and try an oversized query. That separate sandbox uses simulated warehouse and shared-cache adapters, with simulated byte counts and local elapsed times labeled.

For a terminal version: `npm run demo`.

### Re-record with BigQuery

Optional: install `@google-cloud/bigquery`, authenticate with Application Default Credentials, and set `GOOGLE_CLOUD_PROJECT` to your own sandbox billing project.

```sh
npm run record:estimates
# Optional: execute two count checks, each capped at 50,000,000 bytes.
npm run record:estimates -- --verify-summary
# Optional: record three bounded runtime samples for eligible queries.
npm run record:estimates -- --benchmark
```

The default recorder submits **eight dry runs only**. The optional summary check executes two fixed aggregate queries, with `maximumBytesBilled` enforced by BigQuery on each. The recorder saves only public SQL, selected statistics, and output schemas; it omits job IDs, project identifiers, and credentials. Commit a refreshed recording only after reviewing the diff. Recording again without verification removes the previously verified counts, so the lab does not claim they were checked in a newer recording.

`--benchmark` is a separate opt-in that executes eligible queries three times, sequentially, with query-result-cache reuse disabled. Every attempt reserves its full **250 MB** hard cap against a **15 GB** batch ceiling. Queries with larger dry-run estimates are skipped. Recorded metadata separates engine time, queue time, client elapsed time, processed/billed bytes, slot time, and whitelisted execution-stage counters. It is not a controlled cold-cache benchmark.

## What it does

| Boundary | Behavior |
| --- | --- |
| Authorization | Mandatory callback on every call, including memory/shared hits |
| Cache identity | SQL, parameters, explicit parameter types, query ID, scope, publication, location and engine namespace |
| Scope | Explicit shared-dataset or tenant scope supplied by the server |
| L1 / L2 | Bounded in-process LRU; optional private Cloud Storage cache |
| Estimate | Reject invalid/unknown estimates or estimates above the configured cap |
| Execution | Pass `maximumBytesBilled` to BigQuery, independently of the estimate |
| Concurrency | Coalesce identical in-flight work within one guard instance |
| Trace | Cache source, estimated bytes, observed billed bytes, native cache hit, cache warnings |
| Billing metadata | Preserve genuine zero; missing billed bytes remain unknown |
| Publication | Await shared writes; report cache failure without hiding query success |

![Query flow](docs/images/flow.svg)

This is a per-query control, **not a monthly budget, SQL sanitizer, general query sandbox, or universal cap on GCP charges**. See [guarantees and limits](docs/guarantees.md).

## Connect your own BigQuery project

Install the optional Google libraries in your checkout:

```sh
npm install @google-cloud/bigquery @google-cloud/storage
gcloud auth application-default login
```

Set `GOOGLE_CLOUD_PROJECT` to your own sandbox billing project. Then:

```sh
node examples/live-bigquery.js
```

That opt-in example sends a constant parameterized query. For GCS reuse, also set `QUERY_CACHE_BUCKET` to a private disposable cache bucket you control. Never use your archive bucket for disposable cache data.

Prefer an attached service identity on Cloud Run rather than exported service-account keys. Authenticate users and authorize reviewed query templates in your application; the example's `local-demo` principal is only for a local script.

### Application shape

```js
import { BigQuery } from '@google-cloud/bigquery';
import { createQueryGuard } from './src/index.js';
import { bigQueryEngine } from './src/bigquery.js';

const guard = createQueryGuard({
  engine: bigQueryEngine(new BigQuery({ projectId }), {
    namespace: projectId + ':catalog-reader-v1',
  }),
  authorize: async request => canReadCatalog(request.principal),
});

// The server chooses SQL, scope, publication and byte limit.
const result = await guard.run({
  principal: authenticatedUser,
  queryId: 'catalog-count-v1',
  sql: 'SELECT COUNT(*) AS count FROM `YOUR_PROJECT.demo.products` WHERE observed_on = @day',
  params: { day: '2026-01-15' },
  types: { day: 'DATE' },
  publication: 'catalog-2026-01-15-revision-2',
  scope: { kind: 'shared', id: 'public-catalog' },
  location: 'US',
  maxBytesBilled: '100000000',
});

console.log(result.rows, result.trace);
```

`projectId`, `authenticatedUser` and `canReadCatalog` are supplied by your application. Keep SQL and policy fields out of untrusted browser requests. Use a tenant scope for private results; do not share results whose contents depend on row-level permissions or execution identity.

This repository is not published to npm. Use the source or a reviewed, pinned Git commit.

## Verify

```sh
npm test
npm run demo
npm run check:public
```

Tests cover authorization before cache, scope isolation, publication invalidation, expiry, concurrent reuse, failure recovery, zero/unknown billing, SDK options, partial-result rejection and GCS handling. Lab checks ensure measurements stay attached to the exact SQL recorded, that the recorder defaults to dry runs, and that both optional executions have a byte cap. CI uses mocked cloud adapters; public-data measurements are recorded evidence, not a live cloud integration audit.

## Google Cloud building blocks

- [BigQuery dry runs](https://docs.cloud.google.com/bigquery/docs/samples/bigquery-query-dry-run)
- [Query cost controls](https://cloud.google.com/blog/topics/developers-practitioners/controlling-your-bigquery-costs)
- [Native BigQuery query caching](https://docs.cloud.google.com/bigquery/docs/cached-results)

BigQuery already has a native result cache. This application cache reuses results before submitting another query job. Native cache behavior is still reported separately.

[MIT license](LICENSE) · [Contributing](CONTRIBUTING.md) · Companion: [Catalog Match Lab](https://github.com/alejandrofrank/catalog-match-lab).
