import {measurements} from '../data/query-estimates.js';
export const pricing={usdPerTiB:6.25,checkedAt:'2026-10-04',source:'https://cloud.google.com/bigquery',model:'assumed US on-demand list rate; before free allowance, discounts, tax, and billing minimums'};
export function processingCost(bytes,rate=pricing.usdPerTiB) {
  if(bytes===null||bytes===undefined) return null;
  if(typeof bytes!=='string'||!/^\d+$/.test(bytes)||!Number.isFinite(rate)||rate<0) throw new Error('Invalid price inputs');
  const cost=Number(bytes)/2**40*rate;
  if(!Number.isFinite(cost)) throw new Error('Price outside numeric range');
  return cost;
}
export function median(values) {
  const sorted=values.filter(value=>Number.isFinite(value)&&value>=0).sort((a,b)=>a-b);
  if(!sorted.length) return null;
  const middle=Math.floor(sorted.length/2);
  return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;
}
export function runtimeStats(id,recording=measurements) {
  const result=recording.benchmarks?.results[id];
  const runs=result?.runs??[];
  const eligible=runs.filter(run=>run.cacheHit===false);
  const jobs=eligible.map(run=>run.jobMs).filter(Number.isFinite);
  const jobMs=median(jobs);
  const representative=jobMs===null?null:eligible.filter(run=>Number.isFinite(run.jobMs)).sort((a,b)=>Math.abs(a.jobMs-jobMs)-Math.abs(b.jobMs-jobMs))[0];
  return {status:result?.status??'not-recorded',reason:result?.reason,count:eligible.length,runs:eligible,
    jobMs,minMs:jobs.length?Math.min(...jobs):null,maxMs:jobs.length?Math.max(...jobs):null,
    clientMs:median(eligible.map(run=>run.clientMs)),slotMs:median(eligible.map(run=>run.slotMs===null?null:Number(run.slotMs))),
    billedBytes:median(eligible.map(run=>run.billedBytes===null?null:Number(run.billedBytes))),representative};
}
export function compareResults(first,second,recording=measurements) {
  const a=runtimeStats(first,recording),b=runtimeStats(second,recording);
  if(a.status!=='complete'||b.status!=='complete'||!a.count||!b.count) return 'not-verified';
  const digests=[...a.runs,...b.runs].map(run=>run.resultDigest);
  if(digests.some(value=>typeof value!=='string'||!/^[a-f0-9]{64}$/.test(value))) return 'not-verified';
  return new Set(digests).size===1?'equal':'different';
}
