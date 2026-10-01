import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { bigQueryEngine } from '../src/bigquery.js';
import { gcsCache } from '../src/gcs.js';
const request = { sql: 'SELECT @x', params: { x: '1' }, types: { x: 'INT64' }, location: 'US', maxBytesBilled: '99' };
test('BigQuery adapter passes dry-run and hard cap to SDK and refreshes billing metadata', async () => {
  const configs = [];
  const job = { metadata: { statistics: { totalBytesProcessed: '40' } }, async getQueryResults() { return [[{ x: '1' }], null]; }, async getMetadata() { return [{ statistics: { query: { totalBytesBilled: '0', cacheHit: true } } }]; } };
  const engine = bigQueryEngine({ async createQueryJob(config) { configs.push(config); return [job]; } }, { namespace: 'sandbox' });
  assert.equal(await engine.estimate(request), '40');
  const result = await engine.execute(request);
  assert.equal(configs[0].dryRun, true); assert.equal(configs[1].maximumBytesBilled, '99');
  assert.equal(configs[1].location, 'US'); assert.deepEqual(configs[1].types, { x: 'INT64' });
  assert.equal(result.billedBytes, '0'); assert.equal(result.nativeCacheHit, true);
});
test('BigQuery adapter rejects partial/paginated results', async () => {
  const e = bigQueryEngine({ async createQueryJob() { return [{ async getQueryResults() { return [[{ a: 1 }], { pageToken: 'more' }]; } }]; } }, { namespace: 'test' });
  await assert.rejects(e.execute(request), /row limit/);
});
test('GCS cache reads JSON, bounds payloads and awaits private writes', async () => {
  let saved;
  const cache = gcsCache({ file: () => ({ createReadStream: () => Readable.from([Buffer.from('{"rows":[]}')]), async save(body, config) { saved = { body, config }; } }) });
  assert.deepEqual(await cache.get('a'.repeat(64)), { rows: [] });
  await cache.set('a'.repeat(64), { rows: [] });
  assert.equal(saved.config.metadata.cacheControl, 'private, no-store');
  await assert.rejects(cache.set('bad-key', { rows: [] }), /SHA/);
});
test('GCS corrupted objects are misses and oversized reads are rejected', async () => {
  const bucket = value => ({ file: () => ({ createReadStream: () => Readable.from([Buffer.from(value)]) }) });
  assert.equal(await gcsCache(bucket('{bad')).get('b'.repeat(64)), undefined);
  await assert.rejects(gcsCache(bucket('0123456789'), { maxEntryBytes: 2 }).get('b'.repeat(64)), /size bound/);
});
