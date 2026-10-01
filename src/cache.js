// Browser-compatible so the visual sandbox exercises the actual library.
export function stableJson(value) {
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']';
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stableJson(value[k])).join(',') + '}';
  }
  throw new TypeError('Parameters must be plain JSON. Encode dates and large integers as strings with explicit BigQuery types.');
}

export async function fingerprint(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(stableJson(value)));
  return [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, '0')).join('');
}

export class MemoryCache {
  #entries = new Map();
  constructor({ maxEntries = 100 } = {}) {
    if (!Number.isInteger(maxEntries) || maxEntries < 1) throw new TypeError('maxEntries must be positive');
    this.maxEntries = maxEntries;
  }
  async get(key) {
    const value = this.#entries.get(key);
    if (value) {
      this.#entries.delete(key);
      this.#entries.set(key, value);
    }
    return value ? structuredClone(value) : undefined;
  }
  async set(key, value) {
    this.#entries.delete(key);
    this.#entries.set(key, structuredClone(value));
    while (this.#entries.size > this.maxEntries) this.#entries.delete(this.#entries.keys().next().value);
  }
  clear() { this.#entries.clear(); }
}
