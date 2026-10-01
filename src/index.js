import { MemoryCache, fingerprint } from './cache.js';
export { MemoryCache } from './cache.js';

export class QueryLimitError extends Error {
  constructor(estimatedBytes, limitBytes) {
    super('Query estimate exceeds the configured byte limit');
    this.name = 'QueryLimitError';
    this.estimatedBytes = estimatedBytes.toString();
    this.limitBytes = limitBytes.toString();
  }
}
export function bytes(value) {
  if (typeof value === 'number' && (!Number.isSafeInteger(value) || value < 0)) throw new TypeError('Unsafe byte count');
  if (!['string', 'number', 'bigint'].includes(typeof value) || !/^\d+$/.test(String(value))) throw new TypeError('Missing or invalid byte count');
  return BigInt(value);
}
function nonempty(value, name) {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(name + ' is required');
}
function validate(request) {
  for (const name of ['queryId', 'sql', 'publication', 'location']) nonempty(request[name], name);
  if (!request.scope || !['shared', 'tenant'].includes(request.scope.kind)) throw new TypeError('An explicit cache scope is required');
  nonempty(request.scope.id, 'scope.id');
  bytes(request.maxBytesBilled);
}

// Authorize every call, before both cached results and in-flight work.
// The server supplies reviewed SQL, scope and publication; these are not user-controlled policy.
export function createQueryGuard({ engine, authorize, sharedCache, ttlMs = 60_000, maxEntries = 100, maxEntryBytes = 1_048_576, clock = Date.now }) {
  nonempty(engine?.namespace, 'engine.namespace');
  if (typeof authorize !== 'function') throw new TypeError('authorize callback is required');
  if (!Number.isSafeInteger(ttlMs) || ttlMs <= 0 || !Number.isSafeInteger(maxEntryBytes) || maxEntryBytes <= 0) throw new TypeError('Invalid cache bounds');
  const memory = new MemoryCache({ maxEntries });
  const pending = new Map();
  async function run(request) {
    validate(request);
    if (await authorize(request) !== true) throw new Error('Forbidden');
    const key = await fingerprint({
      version: 1, namespace: engine.namespace, queryId: request.queryId, sql: request.sql,
      params: request.params ?? {}, types: request.types ?? {}, scope: request.scope,
      publication: request.publication, location: request.location,
    });
    const warnings = [];
    const valid = entry => entry && Number.isFinite(entry.expiresAt) && entry.expiresAt > clock() && Array.isArray(entry.rows);
    const hit = (entry, source) => ({ rows: entry.rows, trace: { source, estimatedBytes: null, billedBytes: '0', nativeCacheHit: false, warnings } });
    let entry = await memory.get(key);
    if (valid(entry)) return hit(entry, 'memory');
    if (sharedCache) {
      try { entry = await sharedCache.get(key); }
      catch { warnings.push('shared-cache-read-failed'); }
      if (valid(entry)) {
        await memory.set(key, entry);
        return hit(entry, 'shared');
      }
    }
    const pendingKey = key + ':' + bytes(request.maxBytesBilled);
    if (pending.has(pendingKey)) {
      const result = structuredClone(await pending.get(pendingKey));
      return { rows: result.rows, trace: { ...result.trace, source: 'coalesced', billedBytes: '0', warnings: [...warnings, ...result.trace.warnings] } };
    }
    const task = (async () => {
      const estimated = bytes(await engine.estimate(request));
      const limit = bytes(request.maxBytesBilled);
      if (estimated > limit) throw new QueryLimitError(estimated, limit);
      const result = await engine.execute({ ...request, maxBytesBilled: limit.toString() });
      if (!Array.isArray(result.rows)) throw new TypeError('Engine must return rows');
      // Zero is an actual observation. Missing billing metadata stays unknown.
      const billed = result.billedBytes == null ? null : bytes(result.billedBytes).toString();
      const payload = { rows: result.rows, expiresAt: clock() + ttlMs };
      const serialized = JSON.stringify(payload);
      if (new TextEncoder().encode(serialized).byteLength <= maxEntryBytes) {
        await memory.set(key, payload);
        if (sharedCache) {
          try { await sharedCache.set(key, payload); }
          catch { warnings.push('shared-cache-write-failed'); }
        }
      } else warnings.push('result-too-large-to-cache');
      return {
        rows: result.rows,
        trace: { source: 'warehouse', estimatedBytes: estimated.toString(), billedBytes: billed, nativeCacheHit: result.nativeCacheHit === true, warnings },
      };
    })();
    pending.set(pendingKey, task);
    try { return structuredClone(await task); }
    finally { pending.delete(pendingKey); }
  }
  return { run, clearMemory: () => memory.clear() };
}
