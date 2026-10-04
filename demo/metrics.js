export const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const duration=ms=>ms===null||ms===undefined?'Not recorded':ms<1000?Math.round(ms)+' ms':(ms/1000).toFixed(2)+' s';
export const number=value=>value===null||value===undefined?'Unknown':String(value).split('.').map((part,index)=>index?part:part.replace(/\B(?=(\d{3})+(?!\d))/g,',')).join('.');
export const bytes=value=>{if(value===null||value===undefined)return 'Unknown';const n=Number(value),divisor=n>=1e9?1e9:n>=1e6?1e6:n>=1e3?1e3:1;return (n/divisor).toFixed(divisor===1?0:2)+' '+(divisor===1e9?'GB':divisor===1e6?'MB':divisor===1e3?'KB':'B');};
export const money=value=>value===null?'Unknown':'$'+value.toFixed(value===0||value>=.01?4:6);
const delta=(value,unit)=>value===null?'Not compared':Math.abs(value)<.05?'No change':Math.abs(value).toFixed(1)+'% '+(value<0?(unit==='time'?'less time':'less read'):(unit==='time'?'more time':'more read'));
function outputSummary(version,maxRows){
  const runtime=version.runtime;
  if(!runtime.representative)return {value:maxRows===1?'1 aggregate row':'Up to '+maxRows+' rows',note:version.query.schema.length+' fields · schema only'};
  if(runtime.representative.rowCount>1)return {value:runtime.representative.rowCount+' rows',note:version.output.length+' rows previewed'};
  const row=version.output[0]??{};
  const key=['observations','pairs','rows','transactions','total_output'].find(key=>row[key]!==undefined);
  return key?{value:number(row[key]),note:key.replaceAll('_',' ')+' · recorded'+(row.chains!==undefined?' · '+number(row.chains)+' chains':'')}:{value:'1 row',note:'Recorded aggregate'};
}
export function renderComparison(model,validRate=true){
  const $=id=>document.getElementById(id),{versions,experiment}=model;
  const result=model.result;
  const differentFields=JSON.stringify(versions[0].query.schema)!==JSON.stringify(versions[1].query.schema);
  $('result-status').textContent=result==='equal'?'Matching captured output':result==='different'?(differentFields?'Different output fields':'Different captured outputs'):'Output not checked for both';
  $('result-status').className='status '+result;
  const largest=Math.max(...versions.map(v=>Number(v.query.bytes)));
  const rows=[
    {name:'Data read',note:'Dry-run estimate',cells:versions.map((v,i)=>'<strong>'+bytes(v.query.bytes)+'</strong><svg class="scan-track" viewBox="0 0 100 3" preserveAspectRatio="none" aria-hidden="true"><rect width="'+(largest?100*Number(v.query.bytes)/largest:0)+'" height="3" rx="1"/></svg>'+(i?'<small class="delta '+(model.scanChange>0?'more':model.scanChange===0?'flat':'')+'">'+delta(model.scanChange,'scan')+'</small>':''))},
    {name:'Estimated cost',note:'One query · scan × rate',cells:versions.map(v=>'<strong>'+(validRate?money(v.estimatedCost):'Enter rate')+'</strong><small>'+(validRate?money(v.billedCost)+' from billed bytes':'Set a valid rate in How measured')+'</small>')},
    {name:'Runtime',note:'Engine median',cells:versions.map((v,i)=>'<strong>'+duration(v.runtime.jobMs)+'</strong><small>'+(v.runtime.count?v.runtime.count+' recorded runs · cache off':v.runtime.status==='skipped'?'Above the recording cap':'No execution captured')+'</small>'+(i&&model.timeChange!==null?'<small class="delta '+(model.timeChange>0?'more':model.timeChange===0?'flat':'')+'">'+delta(model.timeChange,'time')+'</small>':''))},
    {name:'Output',note:'Recorded result or requested shape',cells:versions.map((v,i)=>{const s=outputSummary(v,experiment.maxRows[i]);return '<div class="output-summary"><strong>'+escape(s.value)+'</strong><small>'+escape(s.note)+'</small></div>';})},
  ];
  for(const i of [0,1])$('variant-'+i+'-metrics').innerHTML=[rows[0],rows[2],rows[1],rows[3]].map((row,index)=>'<div data-metric="'+['read','time','cost','output'][index]+'"><dt>'+row.name+'<span>'+row.note+'</span></dt><dd>'+row.cells[i]+'</dd></div>').join('');
  $('meaning').textContent=model.context.meaning;
  const facts=['Estimated reading: '+bytes(versions[0].query.bytes)+' → '+bytes(versions[1].query.bytes)+' ('+delta(model.scanChange,'scan')+' in B).',model.timeChange===null?'Execution was not captured for both queries; their runtime cannot be compared.':'Recorded engine median: '+duration(versions[0].runtime.jobMs)+' → '+duration(versions[1].runtime.jobMs)+' ('+delta(model.timeChange,'time')+' in B).'];
  $('finding-facts').innerHTML=facts.map(fact=>'<li>'+escape(fact)+'</li>').join('');
}
export function previewHTML(rows){
  if(!rows?.length)return '';
  const keys=Object.keys(rows[0]);
  return '<div class="table-scroll"><table class="detail-table"><thead><tr>'+keys.map(key=>'<th>'+escape(key)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+keys.map(key=>'<td>'+escape(typeof row[key]==='number'||/^-?\d+(\.\d+)?$/.test(String(row[key]))?number(row[key]):row[key])+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
