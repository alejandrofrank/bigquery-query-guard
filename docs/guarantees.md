# Guarantees and limits

## What the code enforces

- Missing authorization callback is a configuration error.
- Every caller must be authorized before cached or in-flight data is returned.
- Invalid, missing or over-limit estimates do not reach execution.
- Every execution through the Google adapter receives `maximumBytesBilled`.
- Private scopes and publication revisions participate in cache identity.
- Observed zero billed bytes stay zero; unavailable billing remains null.
- Failed queries and partial results are not cached.
- Shared writes are awaited, while cache errors are explicit trace warnings.

These properties are checked by offline tests. Live cloud behavior also depends on IAM, query shape, SDK behavior and the deployed configuration.

## What it does not enforce

- A monthly, per-account or whole-platform spending ceiling.
- Reservation/slot costs, storage, networking, remote functions or other service charges.
- SQL safety, tenant authorization policy or protection from every form of data leakage.
- Distributed single-flight execution, durable accounting or automatic cancellation when a caller disconnects.
- Fresh data without an application-supplied publication revision.
- Accurate cost estimates for every query type or external source.

Use this boundary for reviewed, read-only SELECT queries against supported sources. BigQuery's byte estimates can have limitations; engine caps and least-privilege IAM remain important. Native BigQuery caching and capacity-based billing do not become on-demand invoices merely because this library reports bytes.

Authorization decisions must reflect current access even after a cache fills. Do not expose policy fields such as scope, namespace, SQL or publication directly to a browser. Do not use a shared scope for queries personalized by row-level security.

## Release verification

The initial release is verified with offline adapter-contract tests and browser smoke checks. The visual demo uses fictional rows and simulated byte counts. No actual warehouse latency, live provider comparison or cost reduction is claimed.

For a cloud acceptance check, use a disposable project you own: test a partition-filtered query, a cap rejection, a new-instance GCS hit, a revoked principal, an expired result, and a corrected publication. Inspect job metadata and billing separately.
