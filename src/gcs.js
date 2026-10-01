// Use a dedicated PRIVATE disposable cache bucket, never the raw data archive.
// Configure SDK retries/timeouts on the injected Storage client; operations are awaited.
export function gcsCache(bucket, { prefix = 'query-cache/', maxEntryBytes = 1_048_576, timeoutMs = 2000 } = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 || !Number.isSafeInteger(maxEntryBytes) || maxEntryBytes <= 0) throw new TypeError('Invalid cache bounds');
  function file(key) {
    if (!/^[a-f0-9]{64}$/.test(key)) throw new TypeError('Expected SHA-256 cache key');
    return bucket.file(prefix + key + '.json');
  }
  return {
    async get(key) {
      let timer;
      try {
        const chunks = [];
        let size = 0;
        const stream = file(key).createReadStream({ validation: true });
        timer = setTimeout(() => stream.destroy(new Error('Cache read timed out')), timeoutMs);
        for await (const chunk of stream) {
          size += chunk.length;
          if (size > maxEntryBytes) throw new Error('Cache object exceeds size bound');
          chunks.push(chunk);
        }
        return JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch (error) {
        if (Number(error.code) === 404 || error instanceof SyntaxError) return undefined;
        throw error;
      } finally { clearTimeout(timer); }
    },
    async set(key, entry) {
      const body = JSON.stringify(entry);
      if (Buffer.byteLength(body) > maxEntryBytes) return;
      await file(key).save(body, { resumable: false, timeout: timeoutMs, contentType: 'application/json', metadata: { cacheControl: 'private, no-store' } });
    },
  };
}
