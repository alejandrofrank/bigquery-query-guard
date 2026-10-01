import { createQueryGuard, MemoryCache } from '../src/index.js';

// Fully simulated warehouse; the actual guard runs unchanged.
export function createSandbox() {
  let executions = 0, estimates = 0;
  const sharedCache = new MemoryCache();
  const engine = {
    namespace: 'synthetic-sandbox',
    async estimate(r) { estimates++; return r.queryId === 'unbounded' ? '8000000000' : '48000000'; },
    async execute(r) {
      executions++;
      return { rows: [{ product: 'Loma whole milk · 1 L', merchant: 'Market A', price: 2.45 }, { product: 'Loma whole milk · 1 L', merchant: 'Market B', price: 2.79 }], billedBytes: '48000000', nativeCacheHit: false };
    },
  };
  const authorize = async r => r.principal === 'demo-reader';
  const a = createQueryGuard({ engine, authorize, sharedCache });
  const b = createQueryGuard({ engine, authorize, sharedCache });
  const request = {
    principal: 'demo-reader', queryId: 'prices',
    sql: 'SELECT product, merchant, price FROM demo.prices WHERE observed_on = @day',
    params: { day: '2026-01-15' }, types: { day: 'DATE' }, location: 'US',
    publication: 'fixture-v1', scope: { kind: 'shared', id: 'synthetic-catalog' }, maxBytesBilled: '100000000',
  };
  return {
    async run(action) {
      const overrides = action === 'oversized' ? { queryId: 'unbounded', sql: 'SELECT product, merchant, price FROM demo.prices' }
        : action === 'denied' ? { principal: 'no-access' }
        : action === 'tenant' ? { scope: { kind: 'tenant', id: 'demo-tenant-b' } }
        : action === 'refresh' ? { publication: 'fixture-v2' } : {};
      const selected = action === 'instance-b' ? b : a;
      const started = performance.now();
      try {
        const result = await selected.run({ ...request, ...overrides });
        return { ...result, ok: true, ms: performance.now() - started, executions, estimates };
      } catch (error) {
        return { ok: false, error: error.message, estimatedBytes: error.estimatedBytes, limitBytes: error.limitBytes, ms: performance.now() - started, executions, estimates };
      }
    },
  };
}
