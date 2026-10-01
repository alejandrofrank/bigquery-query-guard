import { createSandbox } from './scenarios.js';
const sandbox = createSandbox();
for (const action of ['run', 'run', 'instance-b', 'oversized', 'denied', 'tenant', 'refresh']) {
  console.log(action, JSON.stringify(await sandbox.run(action)));
}
