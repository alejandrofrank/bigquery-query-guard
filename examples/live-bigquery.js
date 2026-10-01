import { BigQuery } from '@google-cloud/bigquery';
import { Storage } from '@google-cloud/storage';
import { createQueryGuard } from '../src/index.js';
import { bigQueryEngine } from '../src/bigquery.js';
import { gcsCache } from '../src/gcs.js';

// Opt-in only. Uses your own Application Default Credentials and billing project.
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
if (!projectId) throw new Error('Set GOOGLE_CLOUD_PROJECT to your own sandbox project');
const bq = new BigQuery({ projectId });
const storage = new Storage({ projectId, retryOptions: { autoRetry: true, maxRetries: 2, totalTimeout: 10 } });
const guard = createQueryGuard({
  engine: bigQueryEngine(bq, { namespace: projectId + ':local-adc-demo' }),
  authorize: async r => r.principal === 'local-demo',
  sharedCache: process.env.QUERY_CACHE_BUCKET ? gcsCache(storage.bucket(process.env.QUERY_CACHE_BUCKET)) : undefined,
});
console.log(await guard.run({
  principal: 'local-demo', queryId: 'constant-example', sql: 'SELECT @message AS message',
  params: { message: 'Hello from your own BigQuery project' },
  publication: 'example-v1', scope: { kind: 'tenant', id: 'local-only' },
  location: 'US', maxBytesBilled: '10000000',
}));
