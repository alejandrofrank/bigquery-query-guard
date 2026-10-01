import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { bigQueryEngine } from '../src/bigquery.js';
import { gcsCache } from '../src/gcs.js';
import { MemoryCache } from '../src/cache.js';
const request = { sql: 'SELECT 1', location: 'US', maxBytesBilled: '100' };
test('unfinished BigQuery jobs are polled, not mistaken for oversized result sets', async () => {
  let attempts = 0;
  const engine = bigQueryEngine({ async createQueryJob() { return [{
    async getQueryResults() { return ++attempts === 1 ? [[], {}, { jobComplete: false }] : [[{ n: 1 }], null, { jobComplete: true }]; },
    async getMetadata() { return [{ statistics: { query: { totalBytesBilled: '0' } } }]; },
  }]; } }, { namespace: 'poll-test' });
  assert.deepEqual((await engine.execute(request)).rows, [{ n: 1 }]); assert.equal(attempts, 2);
});
test('polling expiry requests job cancellation', async () => {
  let cancelled = false;
  const engine = bigQueryEngine({ async createQueryJob() { return [{
    async getQueryResults() { await new Promise(r => setTimeout(r, 5)); return [[], {}, { jobComplete: false }]; },
    async cancel() { cancelled = true; },
  }]; } }, { namespace: 'timeout-test', maxWaitMs: 1 });
  await assert.rejects(engine.execute(request), /polling deadline/); assert.equal(cancelled, true);
});
test('hanging GCS streams are destroyed after the configured deadline', async () => {
  const stream = new Readable({ read() {} });
  const cache = gcsCache({ file: () => ({ createReadStream: () => stream }) }, { timeoutMs: 5 });
  await assert.rejects(cache.get('a'.repeat(64)), /timed out/); assert.equal(stream.destroyed, true);
});
test('memory bounds evict least recently used entries', async () => {
  const cache = new MemoryCache({ maxEntries: 2 });
  await cache.set('a', { rows: [1] }); await cache.set('b', { rows: [2] }); await cache.get('a'); await cache.set('c', { rows: [3] });
  assert.equal(await cache.get('b'), undefined); assert.deepEqual((await cache.get('a')).rows, [1]);
});
