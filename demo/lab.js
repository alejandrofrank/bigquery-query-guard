import { experiments, groups, selection, checkLimit, measurements } from '/examples/query-lab.js';
import { renderMetrics } from '/demo/metrics.js';
const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let experiment='summary',variant=0,guardSequence=0;
function formatBytes(bytes) {
  const value=Number(bytes);
  const [unit,divisor]=value>=1e9?['GB',1e9]:value>=1e6?['MB',1e6]:['KB',1000];
  return {value:(value/divisor).toFixed(value/divisor>=100?1:2),unit};
}
const byteLabel=bytes=>{const f=formatBytes(bytes);return f.value+' '+f.unit;};
function renderSQL(sql,baseline) {
  const original=new Set(baseline.split('\n').map(line=>line.trim()));
  return sql.split('\n').map((line,index)=>'<span class="sql-row '+(variant===1&&line.trim()&&!original.has(line.trim())?'changed':'')+'"><span class="line-no" aria-hidden="true">'+(index+1)+'</span><code>'+escape(line).replace(/\b(SELECT|FROM|WHERE|AND|LIMIT|AS|COUNT|SUM|TIMESTAMP|DATE|WITH|JOIN|CROSS|LEFT|GROUP|BY|UNION|ALL|DISTINCT|UNNEST|AVG|ORDER|ON)\b/g,'<span class="sql-keyword">$1</span>')+'</code></span>').join('');
}
function fieldsHTML(fields) {return fields.map(f=>'<span class="field">'+escape(f.name)+'<small>'+escape(f.type)+'</small></span>').join('');}
function render() {
  ++guardSequence;
  const state=selection(experiment,variant),{experiment:e,query:q,baseline}=state;
  const verified=measurements.summaryVerification;
  $('groups').innerHTML=groups.map(group=>'<button type="button" data-group="'+group.id+'" aria-pressed="'+(group.id===e.group)+'">'+escape(group.label)+'</button>').join('');
  $('experiments').innerHTML=experiments.filter(item=>item.group===e.group).map(item=>'<button type="button" data-experiment="'+item.id+'" aria-pressed="'+(item.id===experiment)+'"><span>'+String(experiments.indexOf(item)+1).padStart(2,'0')+'</span><strong>'+item.label+'</strong></button>').join('');
  const badge=e.id==='summary'?(verified?.equal?'Verified equal count':'Compare counts'):e.badge;
  $('experiment-number').textContent='EXPERIMENT '+String(experiments.findIndex(x=>x.id===experiment)+1).padStart(2,'0')+' / '+badge.toUpperCase();
  $('experiment-title').textContent=e.title; $('question').textContent=e.question;
  $('choices').innerHTML=e.choices.map((label,index)=>'<button type="button" data-variant="'+index+'" aria-pressed="'+(variant===index)+'">'+label+'</button>').join('');
  $('sql').innerHTML=renderSQL(q.sql,baseline.sql); $('original-sql').textContent=baseline.sql;
  const table=[...new Set([...q.sql.matchAll(/(?:FROM|JOIN)\s+`([^`]+)`/g)].map(match=>match[1]))].join(' + ');
  $('source-name').textContent=table;
  $('lesson').textContent=e.lesson; $('tradeoff').textContent=e.tradeoff;
  const formatted=formatBytes(q.bytes); $('scan-value').textContent=formatted.value; $('scan-unit').textContent=formatted.unit;
  $('exact-bytes').textContent=Number(q.bytes).toLocaleString('en-US');
  $('baseline-bytes').textContent=byteLabel(baseline.bytes); $('current-bytes').textContent=byteLabel(q.bytes);
  const largest=Math.max(Number(q.bytes),Number(baseline.bytes));
  $('baseline-bar').setAttribute('width',String(640*Number(baseline.bytes)/largest));
  $('current-bar').setAttribute('width',String(640*Number(q.bytes)/largest));
  $('change-badge').textContent=Math.abs(state.reduction)<.01?'Same estimated scan':Math.abs(state.reduction).toFixed(1)+'% '+(state.reduction<0?'more':'less')+' read';
  $('change-badge').classList.toggle('flat',state.reduction<.01);
  const preferred=['vendor_id','pickup_datetime','total_amount'];
  const visible=e.source==='taxi'?q.schema.filter(f=>preferred.includes(f.name)):q.schema.slice(0,3);
  const extra=q.schema.filter(f=>!visible.includes(f));
  $('output-fields').innerHTML=fieldsHTML(visible); $('all-fields').innerHTML=fieldsHTML(extra);
  $('more-fields').hidden=extra.length===0; $('more-fields').open=false; $('more-fields-label').textContent='+'+extra.length+' other output columns';
  $('output-shape').textContent=q.schema.length+' column'+(q.schema.length===1?'':'s')+' · '+(e.maxRows[variant]===1?'1 aggregate row':'up to '+e.maxRows[variant]+' rows');
  $('result-count').hidden=true;
  $('record-details').textContent='Dry runs: '+measurements.capturedAt+'\nBenchmark: '+(measurements.benchmarks?.capturedAt??'not recorded')+'\nLocation: '+measurements.location+'\nOriginal: '+baseline.bytes+' bytes\nCurrent:  '+q.bytes+' bytes\nQuery cache: disabled\nSource: '+table;
  $('verification-note').textContent='Choices replay bundled recordings; no warehouse requests. Full-result fingerprints hash the captured normalized SDK rows. Decimal previews are displayed as exact text.';
  $('docs-link').href=e.docs; $('record-date').textContent='· '+measurements.capturedAt.slice(0,10);
  $('cap-result').className='cap-result'; $('cap-result').textContent='No query is submitted to Google Cloud from this page.';
  $('check-cap').disabled=false; $('copy-sql').textContent='Copy SQL';
  renderMetrics(state);
}
$('groups').addEventListener('click',event=>{const target=event.target.closest('[data-group]');if(!target)return;experiment=experiments.find(e=>e.group===target.dataset.group).id;variant=0;render();});
$('price-rate').addEventListener('input',()=>{renderMetrics(selection(experiment,variant));});
$('experiments').addEventListener('click',event=>{
  const target=event.target.closest('[data-experiment]'); if(!target) return;
  experiment=target.dataset.experiment;variant=0;render();
});
$('choices').addEventListener('click',event=>{
  const target=event.target.closest('[data-variant]'); if(!target) return;
  variant=Number(target.dataset.variant);render();
});
$('reset').addEventListener('click',()=>{variant=0;$('price-rate').value=6.25;render();});
$('byte-cap').addEventListener('change',()=>{++guardSequence;$('check-cap').disabled=false;$('cap-result').className='cap-result';$('cap-result').textContent='Check the current query against this cap.';});
$('copy-sql').addEventListener('click',async()=>{
  try {await navigator.clipboard.writeText(selection(experiment,variant).query.sql);$('copy-sql').textContent='Copied ✓';}
  catch {$('copy-sql').textContent='Select SQL to copy';}
});
$('check-cap').addEventListener('click',async()=>{
  const token=++guardSequence; $('check-cap').disabled=true;
  try {
    const result=await checkLimit(experiment,variant,$('byte-cap').value);
    if(token!==guardSequence) return;
    $('cap-result').className='cap-result '+(result.allowed?'allowed':'blocked');
    $('cap-result').textContent=result.allowed?'Allowed → local adapter reached. No BigQuery execution; billed bytes remain unknown.':'Blocked before execution → '+byteLabel(result.estimatedBytes)+' exceeds the '+byteLabel(result.limitBytes)+' cap. 0 local executions.';
  } catch(error) {if(token===guardSequence) $('cap-result').textContent=error.message;}
  finally {if(token===guardSequence) $('check-cap').disabled=false;}
});
render();
