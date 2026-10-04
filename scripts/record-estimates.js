import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { queries } from '../examples/query-specs.js';

// Default recording uses dry runs. Verification is a separate, explicit opt-in.
// Record an allowlist of public-query statistics; omit job IDs, identity and billing project.
export async function recordEstimates(client) {
  const results = {};
  for (const [id, query] of Object.entries(queries)) {
    let job;
    try { [job] = await client.createQueryJob({ query, dryRun: true, useQueryCache: false, useLegacySql: false, location: 'US' }); }
    catch(error) { throw new Error(id+': '+error.message); }
    const statistics = job.metadata?.statistics;
    const bytes = statistics?.totalBytesProcessed;
    if (typeof bytes !== 'string' || !/^\d+$/.test(bytes)) throw new Error('Missing estimate for '+id);
    results[id] = { sql: query, bytes, schema: statistics?.query?.schema?.fields?.map(field=>({name:field.name,type:field.type})) ?? [] };
  }
  return { capturedAt: new Date().toISOString(), kind: 'recorded-bigquery-dry-run', location: 'US', useQueryCache: false, queries: results };
}
export async function saveEstimates(data) {
  await writeFile(new URL('../data/query-estimates.js',import.meta.url),'// Recorded public-data dry runs. No credentials, job IDs or billing-project identifiers.\nexport const measurements = '+JSON.stringify(data,null,2)+';\n');
}
export async function verifySummary(client) {
  const results = {};
  for (const id of ['transactionCount', 'blockCount']) {
    const [job] = await client.createQueryJob({
      query: queries[id], maximumBytesBilled: '50000000',
      useQueryCache: false, useLegacySql: false, location: 'US',
    });
    const [rows] = await job.getQueryResults({ maxResults: 2, autoPaginate: false, wrapIntegers: true });
    const count = rows[0]?.transactions;
    const transactions = String(count?.value ?? count);
    if (rows.length !== 1 || !/^\d+$/.test(transactions)) throw new Error('Invalid aggregate result for '+id);
    const [metadata] = await job.getMetadata();
    const billed = metadata.statistics?.query?.totalBytesBilled;
    results[id] = { transactions, billedBytes: typeof billed === 'string' && /^\d+$/.test(billed) ? billed : null };
  }
  return { verifiedAt: new Date().toISOString(), maximumBytesBilled: '50000000', results,
    equal: results.transactionCount.transactions === results.blockCount.transactions };
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(process.argv.slice(2).some(arg=>arg!=='--verify-summary')) throw new Error('Supported option: --verify-summary');
  if(!process.env.GOOGLE_CLOUD_PROJECT) throw new Error('Set GOOGLE_CLOUD_PROJECT to your own sandbox billing project.');
  const { BigQuery } = await import('@google-cloud/bigquery');
  const client = new BigQuery({projectId:process.env.GOOGLE_CLOUD_PROJECT});
  const data = await recordEstimates(client);
  if(process.argv.includes('--verify-summary')) data.summaryVerification = await verifySummary(client);
  await saveEstimates(data);
  console.log('Recorded '+Object.keys(queries).length+' public-data dry-run estimates. '+
    (data.summaryVerification ? 'Executed two aggregate checks, each capped at 50 MB.' : 'No data queries executed.'));
}
