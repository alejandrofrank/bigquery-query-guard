const reference=location.pathname==='/reference';
const {experiments,groups,measurements,checkLimit}=await import(reference?'/examples/query-lab.js':'/examples/market-lab.js');
import {comparisonFor} from '/examples/query-comparison.js';
import {pricing} from '/examples/query-metrics.js';
import {renderComparison,previewHTML,escape,number,bytes,duration} from '/demo/metrics.js';
const $=id=>document.getElementById(id);
const views=['output','runs','limits','method'];
const labels={limit:'Return fewer rows',columns:'Read fewer columns',dates:'Filter an unpartitioned date',time:'Filter time in a view',summary:'Count versus a summary',partitions:'Read fewer partitions',predicate:'Change the date predicate',union:'Keep or remove duplicates',joins:'Group before joining',correlated:'Sum nested arrays',cross:'All pairs versus matching pairs',cte:'Reuse a WITH expression'};
const params=new URLSearchParams(location.search);
let experiment=experiments.some(e=>e.id===params.get('case'))?params.get('case'):reference?'summary':experiments[0].id;
let view=views.includes(params.get('view'))?params.get('view'):'output',runVariant=0,guardSequence=0;
function model(){const rate=$('price-rate').valueAsNumber;return comparisonFor(experiment,Number.isFinite(rate)&&rate>=0&&rate<=1000?rate:pricing.usdPerTiB,measurements,experiments);}
function showView(next,focus=false){
  view=next;
  for(const item of views){const active=item===view;$('tab-'+item).setAttribute('aria-selected',String(active));$('tab-'+item).tabIndex=active?0:-1;$('pane-'+item).hidden=!active;}
  if(focus)$('tab-'+view).focus();
  history.replaceState(null,'','?case='+experiment+'&view='+view);
}
function sqlHTML(sql,original,highlight){
  const lines=new Set(original.split('\n').map(line=>line.trim()));
  return sql.split('\n').map((line,index)=>'<span class="sql-row '+(highlight&&line.trim()&&!lines.has(line.trim())?'changed':'')+'"><span class="line-no" aria-hidden="true">'+(index+1)+'</span><code>'+escape(line).replace(/\b(SELECT|FROM|WHERE|AND|LIMIT|AS|COUNT|SUM|TIMESTAMP|DATE|WITH|JOIN|CROSS|LEFT|GROUP|BY|UNION|ALL|DISTINCT|UNNEST|AVG|ORDER|ON)\b/g,'<span class="sql-keyword">$1</span>')+'</code></span>').join('');
}
function sources(sql){return [...new Set([...sql.matchAll(/(?:FROM|JOIN)\s+`([^`]+)`/g)].map(match=>match[1]))];}
function renderRuns(m){
  $('run-choices').innerHTML=m.versions.map((v,i)=>'<button type="button" data-run="'+i+'" aria-pressed="'+(i===runVariant)+'">'+('AB'[i])+' · '+escape(v.label)+'</button>').join('');
  const r=m.versions[runVariant].runtime;
  if(!r.count){$('run-content').innerHTML='<p class="detail-note">'+escape(r.reason??'No execution was recorded. Runtime and billing remain unknown.')+'</p>';return;}
  const sampleRows=r.runs.map((run,i)=>'<tr><th>'+(i+1)+'</th><td>'+duration(run.jobMs)+'</td><td>'+duration(run.clientMs)+'</td><td>'+duration(run.queueMs)+'</td><td>'+number(run.slotMs)+'</td><td>'+number(run.billedBytes)+'</td></tr>').join('');
  const stages=(r.representative?.stages??[]).map(s=>'<tr><th>#'+escape(s.id)+'<small>'+escape(s.operations.join(' · '))+'</small></th><td>'+number(s.recordsRead)+' → '+number(s.recordsWritten)+'</td><td>'+bytes(s.shuffleBytes)+'</td><td>'+number(s.spilledBytes)+'</td><td>'+number(s.slotMs)+'</td></tr>').join('');
  $('run-content').innerHTML='<h4>Execution samples</h4><p class="detail-note">Engine range '+duration(r.minMs)+'–'+duration(r.maxMs)+'. Client median '+duration(r.clientMs)+'. Small observational samples; storage warmth and slot availability were uncontrolled.</p><div class="table-scroll"><table class="detail-table"><thead><tr><th>Run</th><th>Engine</th><th>Client</th><th>Queue</th><th>Slot-ms</th><th>Billed bytes</th></tr></thead><tbody>'+sampleRows+'</tbody></table></div><h4>Execution stages</h4><p class="detail-note">Sample nearest the engine median ('+duration(r.representative.jobMs)+'). Intermediate row counts and shuffle are not scan bytes. Slot-ms is compute work.</p><div class="table-scroll"><table class="detail-table"><thead><tr><th>Stage / operations</th><th>Rows read → written</th><th>Shuffle</th><th>Spilled bytes</th><th>Slot-ms</th></tr></thead><tbody>'+stages+'</tbody></table></div>';
}
function render(){
  ++guardSequence;const m=model(),e=m.experiment,index=experiments.indexOf(e);
  $('case-nav').innerHTML=groups.map(g=>'<section><h3>'+escape(g.label)+'</h3>'+experiments.filter(item=>item.group===g.id).map(item=>'<button type="button" data-case="'+item.id+'" aria-current="'+(item.id===experiment)+'">'+escape(labels[item.id]??item.label)+'</button>').join('')+'</section>').join('');
  $('case-select').innerHTML=groups.map(g=>'<optgroup label="'+escape(g.label)+'">'+experiments.filter(item=>item.group===g.id).map(item=>'<option value="'+item.id+'" '+(item.id===experiment?'selected':'')+'>'+escape(labels[item.id]??item.label)+'</option>').join('')+'</optgroup>').join('');
  $('case-position').textContent=(index+1)+' / '+experiments.length;$('previous').disabled=index===0;$('next').disabled=index===experiments.length-1;
  $('record-date').textContent='Recorded · '+measurements.capturedAt.slice(0,10);
  $('question').textContent=e.question;$('data-context').textContent=m.context.data;$('change-context').textContent=m.context.change;
  $('lab-title').textContent=reference?'BigQuery reference cases':'Bakiano query lab';
  $('lab-description').textContent=reference?'Other public datasets, recorded for reference.':'Saved scenarios from our supermarket data. Choose a SQL change and compare the recorded result.';
  $('sidebar-note').textContent=reference?'Public datasets. Saved measurements. No cloud requests.':'Frozen Bakiano subset. Pre-run queries. No warehouse access needed.';
  $('dataset-panel').hidden=reference;
  if(!reference){$('dataset-name').textContent=measurements.input.name+' · '+measurements.input.date;$('dataset-rows').innerHTML=previewHTML(measurements.input.rows.map(row=>({Chain:row.source,Listing:row.product_name,'Price as scraped':row.price_current})));$('dataset-note').textContent=measurements.input.note;}
  const valid=$('price-rate').value!==''&&$('price-rate').validity.valid;
  $('sql-pair').innerHTML=m.versions.map((v,i)=>'<article class="variant-card" aria-labelledby="variant-'+i+'-title"><header class="variant-heading"><div class="variant-label"><span aria-hidden="true">'+('AB'[i])+'</span><h3 id="variant-'+i+'-title" aria-label="'+('AB'[i])+' · '+escape(v.label)+'">'+escape(v.label)+'</h3></div><button type="button" data-copy="'+i+'" aria-label="Copy SQL '+('AB'[i])+'">Copy SQL</button></header><div class="variant-query"><pre class="sql-code" aria-label="SQL '+('AB'[i])+'">'+sqlHTML(v.query.sql,m.versions[0].query.sql,i===1)+'</pre><div class="source-name">'+sources(v.query.sql).map(escape).join('<br>')+'</div></div><div class="variant-results"><h4>Recorded results</h4><dl id="variant-'+i+'-metrics" class="variant-metrics"></dl></div></article>').join('');
  renderComparison(m,valid);
  $('lesson').textContent=e.lesson;$('tradeoff').textContent=e.tradeoff;$('docs-link').href=e.docs;
  $('output-pair').innerHTML=m.versions.map((v,i)=>'<article class="output-card"><div class="card-heading"><h4>'+('AB'[i])+' · '+escape(v.label)+'</h4></div><div class="output-content"><p>'+(v.runtime.representative?(v.output.length?'Preview: '+v.output.length+' of '+v.runtime.representative.rowCount+' returned rows.':'Runtime captured for '+v.runtime.representative.rowCount+' returned rows. This recording keeps selected previews only.'):'Schema from a dry run. No data rows captured.')+'</p>'+previewHTML(v.output)+'<div class="field-list">'+v.query.schema.map(f=>'<span class="field">'+escape(f.name)+'<small>'+escape(f.type)+'</small></span>').join('')+'</div></div></article>').join('');
  $('result-proof').textContent=m.result==='equal'?'Full captured result fingerprints match in all runs of both versions. This verifies the bounded returned result, not an entire underlying table.':m.result==='different'?(JSON.stringify(m.versions[0].query.schema)!==JSON.stringify(m.versions[1].query.schema)?'The output fields differ. Previews keep selected fields only; fingerprints cover the complete returned rows, including fields omitted from the preview.':'Result fingerprints differ. Compare the requested scope and aggregate values before treating either approach as an optimization.'):'No complete result comparison was recorded for both versions.';
  renderRuns(m);
  $('limit-version').innerHTML=m.versions.map((v,i)=>'<option value="'+i+'">'+('AB'[i])+' · '+escape(v.label)+'</option>').join('');
  $('cap-result').textContent='No query submitted.';$('cap-result').className='detail-note';$('check-cap').disabled=false;
  $('record-details').textContent='Dry runs: '+measurements.capturedAt+'. Executions: '+(measurements.benchmarks?.capturedAt??'not recorded')+'. Location: '+measurements.location+'.';
  $('capture-limits').textContent='Three sequential executions per eligible query; at most '+bytes(measurements.benchmarks.maximumBytesBilled)+' per attempt and '+bytes(measurements.benchmarks.totalReservationLimit)+' total reserved caps. Larger queries are skipped. Storage warmth and slot availability were uncontrolled.';
  $('source-facts').textContent=[...new Set(m.versions.flatMap(v=>sources(v.query.sql)))].map(name=>{const source=measurements.sources?.[name];return name+': '+(source?.partitioning?source.partitioning.type+' partition on '+source.partitioning.field:source?.type==='VIEW'?'view; physical partition layout not exposed':'table; no date partition configuration')+'.';}).join(' ');
  showView(view);
}
function selectCase(id){experiment=id;runVariant=0;render();}
$('case-nav').addEventListener('click',event=>{const b=event.target.closest('[data-case]');if(b)selectCase(b.dataset.case);});
$('case-select').addEventListener('change',()=>selectCase($('case-select').value));
$('previous').addEventListener('click',()=>selectCase(experiments[experiments.findIndex(e=>e.id===experiment)-1].id));
$('next').addEventListener('click',()=>selectCase(experiments[experiments.findIndex(e=>e.id===experiment)+1].id));
$('reset').addEventListener('click',()=>{$('price-rate').value=pricing.usdPerTiB;$('price-rate').setCustomValidity('');$('price-rate').setAttribute('aria-invalid','false');$('rate-error').hidden=true;runVariant=0;view='output';render();});
$('inspector-tabs').addEventListener('click',event=>{const b=event.target.closest('[data-view]');if(b)showView(b.dataset.view);});
$('inspector-tabs').addEventListener('keydown',event=>{const b=event.target.closest('[data-view]');if(!b)return;let index=views.indexOf(b.dataset.view);if(event.key==='ArrowRight')index=(index+1)%views.length;else if(event.key==='ArrowLeft')index=(index+views.length-1)%views.length;else if(event.key==='Home')index=0;else if(event.key==='End')index=views.length-1;else return;event.preventDefault();showView(views[index],true);});
$('run-choices').addEventListener('click',event=>{const b=event.target.closest('[data-run]');if(b){runVariant=Number(b.dataset.run);renderRuns(model());}});
$('sql-pair').addEventListener('click',async event=>{const b=event.target.closest('[data-copy]');if(!b)return;try{await navigator.clipboard.writeText(model().versions[Number(b.dataset.copy)].query.sql);b.textContent='Copied';}catch{b.textContent='Select SQL to copy';}});
$('price-rate').addEventListener('input',()=>{const rate=$('price-rate').valueAsNumber,valid=Number.isFinite(rate)&&rate>=0&&rate<=1000;$('price-rate').setCustomValidity(valid?'':'Enter a rate from 0 to 1000 USD/TiB.');$('price-rate').setAttribute('aria-invalid',String(!valid));$('rate-error').hidden=valid;renderComparison(model(),valid);});
for(const id of ['limit-version','byte-cap'])$(id).addEventListener('change',()=>{++guardSequence;$('check-cap').disabled=false;$('cap-result').textContent='Check this version against the selected cap.';$('cap-result').className='detail-note';});
$('check-cap').addEventListener('click',async()=>{const token=++guardSequence;$('check-cap').disabled=true;try{const result=await checkLimit(experiment,Number($('limit-version').value),$('byte-cap').value);if(token!==guardSequence)return;$('cap-result').className='detail-note '+(result.allowed?'allowed':'blocked');$('cap-result').textContent=result.allowed?'Allowed by the guard. Local adapter reached; no BigQuery execution and no observed billing.':'Blocked: '+bytes(result.estimatedBytes)+' estimated, '+bytes(result.limitBytes)+' cap. Execution was never reached.';}catch(error){if(token===guardSequence)$('cap-result').textContent=error.message;}finally{if(token===guardSequence)$('check-cap').disabled=false;}});
render();
