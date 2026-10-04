import {processingCost,runtimeStats,compareResults} from '/examples/query-metrics.js';
const $=id=>document.getElementById(id);
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=value=>value===null||value===undefined?'—':Number(value).toLocaleString('en-US');
const duration=ms=>ms===null||ms===undefined?'Not recorded':ms<1000?Math.round(ms)+' ms':(ms/1000).toFixed(2)+' s';
const money=value=>value===null?'Unknown':'$'+value.toFixed(value===0||value>=.01?4:6);
const bytes=value=>value===null||value===undefined?'Unknown':Number(value)>=1e6?(Number(value)/1e6).toFixed(2)+' MB':number(value)+' B';
function previewHTML(rows) {
  if(!rows?.length)return '';
  const keys=Object.keys(rows[0]);
  return '<table><thead><tr>'+keys.map(key=>'<th>'+escape(key)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+keys.map(key=>'<td>'+escape(row[key])+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
}
export function renderMetrics(state) {
  const rate=$('price-rate').valueAsNumber;
  const validRate=Number.isFinite(rate)&&rate>=0&&rate<=1000;
  $('price-rate').setCustomValidity(validRate?'':'Enter a rate from 0 to 1000 USD/TiB.');
  $('price-rate').setAttribute('aria-invalid',String(!validRate));
  const {experiment:e,query:q,queryId,variant}=state;
  const current=runtimeStats(queryId),stats=e.variants.map(id=>runtimeStats(id));
  $('scan-cost').textContent=validRate?money(processingCost(q.bytes,rate)):'Enter rate';
  $('engine-time').textContent=duration(current.jobMs);
  $('runtime-note').textContent=current.count?'median · '+current.count+' samples':'No runtime inferred';
  $('billed-cost').textContent=validRate?money(processingCost(current.billedBytes===null?null:String(current.billedBytes),rate)):'Enter rate';
  $('billed-note').textContent=current.billedBytes===null?'No observed billing':bytes(current.billedBytes)+' · median';
  $('runtime-comparison').innerHTML=stats.map((stat,index)=>'<tr class="'+(index===variant?'selected':'')+'"><th>'+escape(e.choices[index])+'</th><td>'+duration(stat.jobMs)+'</td><td>'+number(stat.slotMs)+'</td></tr>').join('');
  $('sample-note').textContent=current.count?duration(current.minMs)+'–'+duration(current.maxMs)+' engine range · '+duration(current.clientMs)+' client median. Three runs illustrate this recording; they do not establish a universal winner.':current.reason??'No execution samples recorded for this query.';
  $('runtime-details').hidden=!current.count;
  $('samples').innerHTML=current.runs.map((run,index)=>'<tr><th>'+(index+1)+'</th><td>'+duration(run.jobMs)+'</td><td>'+duration(run.clientMs)+'</td><td>'+duration(run.queueMs)+'</td><td>'+number(run.slotMs)+'</td><td>'+number(run.billedBytes)+'</td></tr>').join('');
  const representative=current.representative;
  $('stage-note').textContent=representative?'Stages from the sample nearest the engine median ('+duration(representative.jobMs)+'). Intermediate rows and shuffle are not scan bytes.':'';
  $('stages').innerHTML=(representative?.stages??[]).map(stage=>'<tr><th>#'+escape(stage.id)+'<small>'+escape(stage.operations.join(' · '))+'</small></th><td>'+number(stage.recordsRead)+' → '+number(stage.recordsWritten)+'</td><td>'+bytes(stage.shuffleBytes)+'</td><td>'+number(stage.slotMs)+'</td></tr>').join('');
  $('output-preview').innerHTML=previewHTML(representative?.output);
  $('output-note').textContent=representative?'Recorded preview · '+Math.min(3,representative.rowCount)+' of '+representative.rowCount+' returned rows. Values come from real capped executions.':'Output schema from the dry run. No data rows were recorded for this query.';
  const comparison=compareResults(...e.variants);
  $('result-comparison').textContent=comparison==='equal'?'All captured full-result fingerprints match across both versions.':comparison==='different'?'Captured result fingerprints differ. Check result meaning before comparing efficiency.':'Result equality was not verified for both versions.';
}
