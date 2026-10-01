// Inject an authenticated @google-cloud/bigquery client. No credentials are read here.
export function bigQueryEngine(client, { namespace, maxRows = 10_000, maxWaitMs = 60_000 } = {}) {
  if (typeof namespace !== 'string' || !namespace) throw new TypeError('Use a namespace identifying the billing project and execution identity');
  if (!Number.isSafeInteger(maxRows) || maxRows < 1 || maxRows > 100_000) throw new TypeError('Invalid maxRows');
  if (!Number.isSafeInteger(maxWaitMs) || maxWaitMs < 1 || maxWaitMs > 300_000) throw new TypeError('Invalid maxWaitMs');
  function config(r) {
    return { query: r.sql, params: r.params ?? {}, ...(r.types && { types: r.types }), location: r.location, useLegacySql: false };
  }
  return {
    namespace,
    async estimate(r) {
      const [job] = await client.createQueryJob({ ...config(r), dryRun: true });
      return job.metadata?.statistics?.totalBytesProcessed;
    },
    async execute(r) {
      const [job] = await client.createQueryJob({ ...config(r), maximumBytesBilled: String(r.maxBytesBilled) });
      const started = Date.now();
      let page;
      do {
        page = await job.getQueryResults({ maxResults: maxRows + 1, autoPaginate: false, wrapIntegers: true });
        if (page[2]?.jobComplete !== false) break;
        if (Date.now() - started >= maxWaitMs) {
          try { await job.cancel(); } catch { /* The engine cap still applies if cancellation fails. */ }
          throw new Error('Query did not finish within the polling deadline');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      } while (true);
      const [rows, nextPage] = page;
      if (rows.length > maxRows || nextPage) throw new Error('Result exceeds row limit; narrow the reviewed query');
      const [metadata] = await job.getMetadata();
      return {
        rows: JSON.parse(JSON.stringify(rows)),
        billedBytes: metadata.statistics?.query?.totalBytesBilled ?? null,
        nativeCacheHit: metadata.statistics?.query?.cacheHit === true,
      };
    },
  };
}
