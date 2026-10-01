import { createSandbox } from '/examples/scenarios.js';
const $ = id => document.getElementById(id);
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
let sandbox = createSandbox(), logs = [], hits = 0, billed = 0n;
const names = { run: 'Instance A', 'instance-b': 'Instance B', oversized: 'Oversized', denied: 'Unauthorized', tenant: 'Tenant B', refresh: 'Publication v2' };
const outcomes = { warehouse: 'Executed within the byte limit.', memory: 'Served from this instance’s cache.', shared: 'Reused across application instances.', coalesced: 'Reused in-flight work.' };
function path(result, action) {
  for (const name of ['auth', 'memory', 'shared', 'estimate', 'warehouse']) $(name).className = 'node';
  if (action === 'denied') { $('auth').classList.add('stopped'); return; }
  $('auth').classList.add('visited'); $('memory').classList.add('visited');
  if (result.trace?.source === 'memory') return;
  $('shared').classList.add('visited');
  if (result.trace?.source === 'shared') return;
  $('estimate').classList.add(result.ok ? 'visited' : 'stopped');
  if (result.ok) $('warehouse').classList.add('visited');
}
async function run(action) {
  document.querySelectorAll('button[data-action]').forEach(b => b.disabled = true);
  try {
    const result = await sandbox.run(action);
    const source = result.trace?.source ?? 'blocked';
    if (['memory', 'shared', 'coalesced'].includes(source)) hits++;
    billed += BigInt(result.trace?.billedBytes ?? 0);
    logs.unshift({ action, result, source }); logs = logs.slice(0, 8);
    $('outcome').textContent = result.ok ? outcomes[source] : result.error;
    $('source').textContent = source.toUpperCase();
    $('executions').textContent = result.executions;
    $('cache').textContent = hits;
    $('billed').textContent = (Number(billed) / 1e6).toFixed(0) + ' MB';
    $('log').innerHTML = logs.map(l => '<tr><td>' + names[l.action] + '</td><td><span class="' + (l.result.ok ? 'yes' : 'no') + '">' + escape(l.source) + '</span></td><td>' + (l.result.trace?.billedBytes == null ? (l.result.ok ? 'Unknown' : '0') : (Number(l.result.trace.billedBytes) / 1e6).toFixed(0)) + ' MB</td><td>' + l.result.ms.toFixed(2) + ' ms</td></tr>').join('');
    $('trace').textContent = JSON.stringify(result, null, 2);
    path(result, action);
  } finally { document.querySelectorAll('button[data-action]').forEach(b => b.disabled = false); }
}
document.querySelectorAll('[data-action]').forEach(button => button.onclick = () => run(button.dataset.action));
$('reset').onclick = () => {
  sandbox = createSandbox(); logs = []; hits = 0; billed = 0n;
  $('executions').textContent = '0'; $('cache').textContent = '0'; $('billed').textContent = '0 MB';
  $('outcome').textContent = 'Ready for your first query.'; $('source').textContent = 'IDLE';
  $('trace').textContent = 'No request yet.'; $('log').innerHTML = '<tr><td colspan="4" class="muted">Choose an action to inspect its path.</td></tr>';
  for (const name of ['auth', 'memory', 'shared', 'estimate', 'warehouse']) $(name).className = 'node';
};
