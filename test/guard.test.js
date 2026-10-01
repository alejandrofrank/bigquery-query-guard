import test from 'node:test';
import assert from 'node:assert/strict';
import { createQueryGuard, MemoryCache, QueryLimitError } from '../src/index.js';
import { fingerprint, stableJson } from '../src/cache.js';
const request = { principal: 'reader', queryId: 'prices', sql: 'SELECT @day AS day', params: { day: '2026-01-15' }, publication: 'v1', location: 'US', scope: { kind: 'shared', id: 'catalog' }, maxBytesBilled: '100' };
function fixture(options = {}) {
  let queries = 0, estimates = 0;
  const engine = { namespace: 'test-project:identity', async estimate() { estimates++; return '50'; }, async execute(r) { queries++; assert.equal(r.maxBytesBilled, '100'); return { rows: [{ price: 2 }], billedBytes: '0', nativeCacheHit: true }; }, ...options.engine };
  const guard = createQueryGuard({ engine, authorize: async r => r.principal === 'reader', ...options, engine });
  return { ...guard, engine, count: () => queries, estimates: () => estimates };
}
test('memory hits skip warehouse, preserve observed zero and do not leak mutations', async () => {
  const f = fixture(); const first = await f.run(request);
  assert.equal(first.trace.billedBytes, '0'); assert.equal(first.trace.nativeCacheHit, true);
  first.rows[0].price = 900;
  assert.equal((await f.run(request)).rows[0].price, 2);
  assert.equal(f.count(), 1);
});
test('a new instance reuses shared results without querying', async () => {
  const sharedCache = new MemoryCache();
  const a = fixture({ sharedCache }), b = fixture({ sharedCache });
  await a.run(request); assert.equal((await b.run(request)).trace.source, 'shared'); assert.equal(b.count(), 0);
});
test('authorization still runs for cached and concurrent results', async () => {
  const f = fixture(); await f.run(request);
  await assert.rejects(f.run({ ...request, principal: 'intruder' }), /Forbidden/);
  assert.equal(f.count(), 1);
});
test('oversized dry run never executes', async () => {
  const f = fixture({ engine: { async estimate() { return '101'; } } });
  await assert.rejects(f.run(request), QueryLimitError); assert.equal(f.count(), 0);
});
test('unknown or invalid estimates fail closed', async () => {
  for (const estimate of [undefined, null, -1, NaN, 'not-bytes', Number.MAX_SAFE_INTEGER + 1]) {
    const f = fixture({ engine: { async estimate() { return estimate; } } });
    await assert.rejects(f.run(request), TypeError); assert.equal(f.count(), 0);
  }
});
test('SQL, parameters, publication, tenant and region each separate cache entries', async () => {
  const f = fixture(); await f.run(request);
  const changes = [{ sql: 'SELECT @day AS changed' }, { params: { day: '2026-01-16' } }, { publication: 'v2' }, { scope: { kind: 'tenant', id: 'alice' } }, { scope: { kind: 'tenant', id: 'bob' } }, { location: 'EU' }, { types: { day: 'DATE' } }];
  for (const change of changes) assert.equal((await f.run({ ...request, ...change })).trace.source, 'warehouse');
  assert.equal(f.count(), 1 + changes.length);
});
test('engine namespace prevents cross-project shared cache reuse', async () => {
  const sharedCache = new MemoryCache();
  await fixture({ sharedCache }).run(request);
  const b = fixture({ sharedCache, engine: { namespace: 'another-project:identity' } });
  assert.equal((await b.run(request)).trace.source, 'warehouse');
});
test('expired shared and memory entries are recomputed', async () => {
  let now = 10;
  const f = fixture({ clock: () => now, ttlMs: 20, sharedCache: new MemoryCache() });
  await f.run(request); now = 31; assert.equal((await f.run(request)).trace.source, 'warehouse'); assert.equal(f.count(), 2);
});
test('concurrent requests coalesce once and every caller is authorized', async () => {
  let authorized = 0;
  const f = fixture({ authorize: async () => { authorized++; return true; } });
  const results = await Promise.all(Array.from({ length: 12 }, () => f.run(request)));
  assert.equal(f.count(), 1); assert.equal(authorized, 12);
  assert.equal(results.filter(r => r.trace.source === 'warehouse').length, 1);
});
test('failed execution is not cached and in-flight state is cleared', async () => {
  let attempts = 0;
  const f = fixture({ engine: { async execute() { attempts++; throw new Error('warehouse down'); } } });
  await assert.rejects(f.run(request), /warehouse down/);
  await assert.rejects(f.run(request), /warehouse down/); assert.equal(attempts, 2);
});
test('cache failure reports warnings but preserves guarded execution', async () => {
  const f = fixture({ sharedCache: { async get() { throw new Error('offline'); }, async set() { throw new Error('offline'); } } });
  const result = await f.run(request);
  assert.deepEqual(result.trace.warnings, ['shared-cache-read-failed', 'shared-cache-write-failed']);
});
test('shared writes complete before successful response', async () => {
  let written = false;
  const f = fixture({ sharedCache: { async get() {}, async set() { await new Promise(r => setTimeout(r, 5)); written = true; } } });
  await f.run(request); assert.equal(written, true);
});
test('missing billing metadata stays unknown instead of becoming an estimate', async () => {
  const f = fixture({ engine: { async execute() { return { rows: [], billedBytes: null }; } } });
  assert.equal((await f.run(request)).trace.billedBytes, null);
});
test('large results are served without caching', async () => {
  const f = fixture({ maxEntryBytes: 5 }); await f.run(request); await f.run(request); assert.equal(f.count(), 2);
});
test('cache keys canonicalize key order and reject unsupported parameters', async () => {
  assert.equal(await fingerprint({ b: 2, a: 1 }), await fingerprint({ a: 1, b: 2 }));
  for (const value of [undefined, NaN, new Date(), 1n]) assert.throws(() => stableJson({ value }), TypeError);
});
test('required authorization and cache scope cannot be omitted', async () => {
  assert.throws(() => createQueryGuard({ engine: { namespace: 'x' } }), /authorize/);
  await assert.rejects(fixture().run({ ...request, scope: undefined }), /scope/);
});
