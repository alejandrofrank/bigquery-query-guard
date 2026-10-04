# BigQuery scan lab: evidence and limits

The lab compares reviewed SQL variants against recorded BigQuery dry-run measurements. It does not approximate costs from a synthetic row count or execute a browser's arbitrary SQL.

## What was measured

[`examples/query-specs.js`](../examples/query-specs.js) defines eight fixed queries. [`scripts/record-estimates.js`](../scripts/record-estimates.js) submits each with `dryRun: true`, `useQueryCache: false`, GoogleSQL, and US location. It publishes only the SQL, `totalBytesProcessed`, and output field names/types. [`data/query-estimates.js`](../data/query-estimates.js) includes the capture timestamp.

The initial recording was captured on 2026-10-04. Exact recorded bytes are preserved as strings; the UI uses decimal MB and GB. No latency measurement was recorded.

| Public source | Inspected source type | Relevant constraint |
| --- | --- | --- |
| `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` | Table, no date partition configuration in metadata | Adding a pickup-time filter did not reduce this scan estimate |
| `bigquery-public-data.crypto_bitcoin.transactions` | View | Its physical partition configuration and view SQL are not exposed through this public metadata endpoint |
| `bigquery-public-data.crypto_bitcoin.blocks` | View | Block summaries can answer a transaction count but cannot provide individual transaction values |

Source types above were checked through BigQuery metadata on the capture date. We report the planner's measured change for the Bitcoin time slice; we do not infer a physical partition count or guarantee the same reduction for other tables.

## Result verification

Dry runs return a schema, not data rows. The lab shows schemas for the row-preview experiments; it does not invent sample output. The count experiment has a separate recorded verification:

- `COUNT(*)` over transactions: **657,752**.
- `SUM(transaction_count)` over blocks: **657,752**.
- Both queries cover 2024-01-01 UTC with month/day predicates and disable result-cache reuse.
- Each execution sets `maximumBytesBilled: '50000000'`.
- Observed billed bytes were **14,680,064** and **10,485,760**, respectively. Those differ from the dry-run estimates and are stored separately.

The agreement was observed at the recorded verification timestamp. It is not a universal interchangeability guarantee: late data and refresh timing can differ. A refreshed recording without a summary check no longer displays verified counts.

## Reproduce

Install Node.js 22 or newer and the optional BigQuery SDK. Authenticate with your own Application Default Credentials and use your own sandbox billing project:

```sh
npm install @google-cloud/bigquery
gcloud auth application-default login
# Set GOOGLE_CLOUD_PROJECT using your shell's environment syntax.
npm run record:estimates
```

This records eight dry runs without executing data queries. To additionally execute the two bounded aggregate checks:

```sh
npm run record:estimates -- --verify-summary
```

Public data can change. Review the resulting diff rather than expecting permanent byte counts. Recordings contain no billing project ID, identity, job IDs, or credentials. If a recording or verification fails, the previous file is left in place.

## Guard integration

The page's byte-cap check invokes `createQueryGuard` with recorded estimates and a local adapter. It demonstrates preflight refusal and exercises the real policy path. The local adapter returns schema metadata only. It submits no BigQuery job; its billing remains unknown.

Production code uses [`src/bigquery.js`](../src/bigquery.js) to set BigQuery's `maximumBytesBilled` during actual execution, independently of the preflight check. Applications must still authorize reviewed SQL and choose scope, publication, and limits on the server. See [guarantees](guarantees.md).

## Interpretation

`LIMIT` reduces returned rows but does not by itself bound the scan of selected columns in these recorded queries. Column projection removes fields from the question. Date predicates narrow the question, but the storage/query layout determines whether reading can also be reduced. A summary changes available detail; it is useful only when it answers the intended question.

A dry-run estimate is not an invoice. Billed bytes, query-cache reuse, minimum billing increments, and actual execution pruning can differ. The lab does not calculate dollar savings or compare query speed.

Official references: [dry runs](https://docs.cloud.google.com/bigquery/docs/running-queries#dry-run), [query compute practices](https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute), [partition filtering](https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables), and [cost controls](https://docs.cloud.google.com/bigquery/docs/best-practices-costs).
