# Bakiano query lab: frozen input and pre-run evidence

The default page shows a small recognizable slice of Bakiano's supermarket data. Users change the displayed scenario, not a production query. Every estimate, execution sample and preview is already bundled; the browser needs no credentials and makes no cloud calls.

## Input and scope

The capture uses the latest loaded supermarket partition, **2026-10-04**, with the name filter `LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'`. The latest-day input contains four listings from Farmatodo, Locatel and Plan Suárez. It includes cream because this is a literal name filter, not a verified product-identity match. Carton sizes and formulations are not interchangeable.

The preview retains only chain, listing name and scraped price. Prices are not normalized USD, inventory is not verified, and this frozen capture is not a live price feed. The history comparison covers the same name filter over 30 dates; the four visible input rows are the latest-day preview, not the entire historical input.

Measurements came from the original partitioned warehouse using these filters. **A tiny returned subset can still require a large warehouse scan.** Importing the preview into a tiny new table would produce different byte estimates and timings.

## Recorded scenarios

| Scenario | Estimated reading A → B | Engine median A → B | Captured result |
| --- | --- | --- | --- |
| Latest day inside query vs resolved date | 826.70 → 3.66 MB | 589 → 213 ms | Both: four observations, three chains |
| 30-day history vs one day | 111.92 → 3.66 MB | 342 → 213 ms | 166 observations / five chains vs four / three |
| All fields vs three price-card fields | 18.71 → 6.30 MB | 209 → 213 ms | Same four listings; different output fields |
| Product ID vs source + product ID enrichment join | 17.80 → 21.04 MB | 331 → 294 ms | Both: eight joined rows, four schema-v4 rows |
| Repeated batch: ALL vs DISTINCT | 3.08 → 5.80 MB | 198 → 225 ms | Eight vs four observations |
| Two scalar subqueries vs one aggregate | 3.66 → 3.66 MB | 215 → 203 ms | Same observation and chain counts |
| Preview limits 20 vs five | 18.71 → 18.71 MB | 209 → 224 ms | Both return all four available rows |
| FORMAT_DATE vs direct partition date | 826.70 → 3.66 MB | 569 → 213 ms | Same observation and chain counts |

The date constant represents the application's resolved `@data_date` parameter. The comparison excludes the separate lookup that finds the latest loaded day; that lookup is reused by the app's date cache and has its own cost.

The enrichment experiment deliberately isolates the identity join. Our serving query additionally pins schema version 4. Multiple enrichment versions explain why this isolated join returns eight rows from four raw listings. Matching outputs in this sample do not prove that product IDs alone are globally safe keys.

`LIMIT` is a maximum, not a requested exact count: this sample has only four listings, so both five and twenty include everything. Different fields produce different full-result fingerprints even when the selected preview fields look identical.

## Evidence and interpretation

[`data/market-recording.js`](../data/market-recording.js) contains 13 SQL variants and 39 execution samples. SQL uses `YOUR_PROJECT` in place of the private project identifier. The selected preview omits product IDs, source URLs and raw metadata. Result fingerprints cover the complete bounded returned rows; stage evidence retains operation kinds and numeric counters, not physical execution-step text or job IDs.

Dry-run bytes, observed billed bytes and slot work are separate measurements. For the latest-day case, estimated bytes were 826,704,750 versus 3,664,924, while observed billed bytes were 120,586,240 versus 10,485,760. A dry run is not an invoice.

The assumed on-demand rate is adjustable. Both estimated-scan and observed-billed-byte dollar calculations use `bytes / 2^40 × USD-per-TiB`, before free allowance, discounts and tax. Runtime is the median of three sequential jobs with result-cache reuse disabled; storage warmth and slot availability were uncontrolled. Small differences are not universal optimization claims.

## Refresh deliberately

Viewing the lab does not require this step. A maintainer with access to a warehouse using these schemas can run [`scripts/record-market.js`](../scripts/record-market.js) explicitly with `--benchmark`, the optional BigQuery SDK, Application Default Credentials, `GOOGLE_CLOUD_PROJECT`, and `LAB_RECORDING_FILE` pointing **outside this public checkout**.

Each attempted execution reserves its full selected hard cap against a 12 GB batch ceiling. Per-query caps are 100 MB, 150 MB or at most 1 GB, chosen from the dry-run estimate. Oversized queries are skipped. Every execution also passes its cap to BigQuery, disables the result cache and sets a 30-second server timeout. Failed timings are not invented. The committed capture reserved 9.45 GB of caps; reservations are not actual billed bytes.

Review and curate the external capture before publishing a replacement. Preserve the exact measured SQL, keep raw listing previews to the approved fields, replace project identifiers, and exclude identities, keys, job IDs, customer data and internal URLs. The publication check and offline tests provide additional checks.

## Page flow

Choose a scenario in the sidebar or compact selector. The frozen input appears first, followed by the question and SQL change. Both approaches' reading, cost, runtime and output remain together in one comparison. SQL, selected outputs, runs/stages, the local byte-cap guard and measurement definitions have separate inspector tabs.

The byte-cap button exercises the actual guard library against saved estimates with a local adapter. It never submits a warehouse job. `/reference` retains other public-dataset experiments; `/guard` retains the simulated cache and authorization sandbox.
