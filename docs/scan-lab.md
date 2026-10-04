# BigQuery scan lab: evidence and limits

The lab compares reviewed SQL variants against recorded BigQuery dry-run measurements. It does not approximate costs from a synthetic row count or execute a browser's arbitrary SQL.

## What was measured

[`examples/query-specs.js`](../examples/query-specs.js) collects 21 fixed queries, including [storage cases](../examples/storage-specs.js) and [composition cases](../examples/composition-specs.js). [`scripts/record-estimates.js`](../scripts/record-estimates.js) submits each with `dryRun: true`, `useQueryCache: false`, GoogleSQL, and US location. It publishes SQL, `totalBytesProcessed`, output field names/types and allowlisted source metadata. [`data/query-estimates.js`](../data/query-estimates.js) includes separate dry-run and benchmark capture timestamps.

The expanded recording was captured on 2026-10-04. Exact recorded bytes are preserved as strings; the UI uses decimal MB and GB. Fifteen eligible queries each have three sequential, uncached-result execution samples. Six oversized queries were skipped.

| Public source | Inspected source type | Relevant constraint |
| --- | --- | --- |
| `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022` | Table, no date partition configuration in metadata | Adding a pickup-time filter did not reduce this scan estimate |
| `bigquery-public-data.crypto_bitcoin.transactions` | View | Its physical partition configuration and view SQL are not exposed through this public metadata endpoint |
| `bigquery-public-data.crypto_bitcoin.blocks` | View | Block summaries can answer a transaction count but cannot provide individual transaction values |
| `bigquery-public-data.google_trends.top_terms` | Table, DAY partition on `refresh_date` | Cases use populated refresh dates 2026-09-25 through 2026-10-01; score sums are dataset aggregates, not absolute search volumes |

Source types above were checked through BigQuery metadata on the capture date. We report the planner's measured change for the Bitcoin time slice; we do not infer a physical partition count or guarantee the same reduction for other tables.

## Result verification

Dry runs return a schema, not data rows. The lab shows real aggregate previews only when execution was recorded. The count experiment was verified in the execution samples:

- `COUNT(*)` over transactions: **657,752**.
- `SUM(transaction_count)` over blocks: **657,752**.
- Both queries cover 2024-01-01 UTC with month/day predicates and disable result-cache reuse.
- Recorded benchmark executions set `maximumBytesBilled: '300000000'`. The separate optional `--verify-summary` path caps its two checks at 50,000,000 bytes each.
- Observed billed bytes were **14,680,064** and **10,485,760**, respectively. Those differ from the dry-run estimates and are stored separately.

The agreement was observed at the recorded execution timestamp. It is not a universal interchangeability guarantee: late data and refresh timing can differ. A refreshed recording without execution no longer displays old measured results.

Result fingerprints cover the complete bounded returned result, not an underlying full table. Joins return 100 ordered blocks; only three aggregate rows appear in the preview. The committed capture hashes the SDK-normalized scalar representation; decimal previews were formatted as exact text without changing those original fingerprints, bytes or timings. New recorder runs normalize SDK decimal objects to exact strings before hashing. Compare fingerprints within a recording, not across encoder versions.

## Cases and result meaning

| Comparison | What the recording establishes | What it does not establish |
| --- | --- | --- |
| One vs seven partitions | Daily partition metadata and reduced estimated scan | Equivalent history coverage |
| Function vs direct partition predicate | Same requested date; estimates 377.6 MB vs 11.7 MB | Measured runtime/equality of both; the wider query was skipped |
| `UNION ALL` vs `UNION DISTINCT` | Duplicate counts 310 vs 155; stage/slot evidence | Interchangeable results |
| Raw vs pre-aggregated join | Matching fingerprints for 100 ordered blocks; median 4.18 s vs 3.27 s | A speed guarantee on another dataset or full-table equality |
| Correlated aggregate vs `UNNEST` | Same captured aggregate and visible execution stages | A specific physical nested-loop implementation |
| Cartesian vs keyed join | 24,025 vs 155 pairs | An equivalent optimization; the questions differ |
| Repeated CTE vs one pass | Matching metrics and measured stage work | That every repeated CTE is materialized or recomputed |

For the count example, less estimated reading accompanied a longer measured engine median: 3.61 s for block summaries versus 613 ms for transactions. These observations motivate inspecting cost and time independently.

## Reproduce

Install Node.js 22 or newer and the optional BigQuery SDK. Authenticate with your own Application Default Credentials and use your own sandbox billing project:

```sh
npm install @google-cloud/bigquery
gcloud auth application-default login
# Set GOOGLE_CLOUD_PROJECT using your shell's environment syntax.
npm run record:estimates
```

This records 21 dry runs without executing data queries. To additionally execute the two bounded aggregate checks:

```sh
npm run record:estimates -- --verify-summary
```

Public data can change. Review the resulting diff rather than expecting permanent byte counts. Recordings contain no billing project ID, identity, job IDs, or credentials. If a recording or verification fails, the previous file is left in place.

### Optional runtime measurements

`npm run record:estimates -- --benchmark` executes eligible queries three times in order, with `useQueryCache: false` and a 30-second server job timeout. The recorder reserves 300,000,000 bytes before each attempt against a 15,000,000,000-byte batch ceiling, even if that attempt fails. BigQuery also receives `maximumBytesBilled` on every execution. Oversized estimates are skipped. Estimates are not execution permission: refreshed views can make the engine refuse a previously eligible query. A later bounded validation did encounter this cap; no failed timing replaced the earlier successful recording.

Engine time is `endTime - startTime`; queue time is `startTime - creationTime`. Client elapsed time includes submission, network, polling, and result retrieval, and is recorded separately. Slot milliseconds represent accumulated compute work, not wall-clock time. Result-cache reuse is disabled; storage warming, slot availability, optimizer behavior, and changing public data can still affect repeated runs. These samples do not establish a universal winner.

Stage records keep operation kinds, records read/written, shuffle bytes, spill bytes, and slot milliseconds. They omit step text, physical table paths, job IDs, and identities. Failures have no invented timing. Unknown billing remains unknown. Output fingerprints are for the bounded returned result; only selected aggregate field names can be stored as a small public preview.

## Guard integration

The page's byte-cap check invokes `createQueryGuard` with recorded estimates and a local adapter. It demonstrates preflight refusal and exercises the real policy path. The local adapter returns schema metadata only. It submits no BigQuery job; its billing remains unknown.

Production code uses [`src/bigquery.js`](../src/bigquery.js) to set BigQuery's `maximumBytesBilled` during actual execution, independently of the preflight check. Applications must still authorize reviewed SQL and choose scope, publication, and limits on the server. See [guarantees](guarantees.md).

## Interpretation

`LIMIT` reduces returned rows but does not by itself bound the scan of selected columns in these recorded queries. Column projection removes fields from the question. Date predicates narrow the question, but the storage/query layout determines whether reading can also be reduced. A summary changes available detail; it is useful only when it answers the intended question.

A dry-run estimate is not an invoice. Billed bytes, query-cache reuse, minimum billing increments, and actual execution pruning can differ. The adjustable default is an assumed US on-demand $6.25/TiB list rate, checked on 2026-10-04. Cost is `bytes / 2^40 × USD-per-TiB`. Estimated scan and observed billed-byte calculations are separate, before free allowance, discounts and tax; the scan calculation excludes minimum billing increments. Slot-ms is compute work, not an on-demand dollar charge. Runtime is shown only from recorded executions, with three samples and their range.

Official references: [dry runs](https://docs.cloud.google.com/bigquery/docs/running-queries#dry-run), [query compute practices](https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute), [partition filtering](https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables), [cost controls](https://docs.cloud.google.com/bigquery/docs/best-practices-costs), and [pricing](https://cloud.google.com/bigquery).
