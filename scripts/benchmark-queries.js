import { createHash } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { queries } from '../examples/query-specs.js';

const integer = value => typeof value === 'string' && /^\d+$/.test(value) ? value : null;
const previewFields = new Set(['transactions','total_output','pairs','rows','score_total','block_number','mean_size']);
function plain(value) {
  if(Array.isArray(value)) return value.map(plain);
  if(value && typeof value === 'object') {
    // The SDK returns NUMERIC as a decimal object. Preserve exact decimal text.
    if(typeof value.toFixed==='function' && Array.isArray(value.c)) return value.toFixed();
    if('value' in value) return plain(value.value);
    return Object.fromEntries(Object.keys(value).sort().map(key=>[key,plain(value[key])]));
  }
  return value;
}
function elapsed(end,start) {
  return integer(end)!==null && integer(start)!==null && BigInt(end)>=BigInt(start) ? Number(BigInt(end)-BigInt(start)) : null;
}
function publicStages(stages=[]) {
  return stages.map(stage=>({
    id:stage.id, operations:[...new Set((stage.steps??[]).map(step=>step.kind))],
    recordsRead:integer(stage.recordsRead),recordsWritten:integer(stage.recordsWritten),
    shuffleBytes:integer(stage.shuffleOutputBytes),spilledBytes:integer(stage.shuffleOutputBytesSpilled),
    slotMs:integer(stage.slotMs),
  }));
}

// Sequential fixed queries. Reserve the full hard cap BEFORE each attempt, even if it fails.
// This bounds submitted work without relying on missing or delayed billing metadata.
export async function benchmarkQueries(client,recording,{samples=3,maxBytes='300000000',totalBytes='15000000000',ids=Object.keys(queries),onProgress=()=>{}}={}) {
  if(!Number.isInteger(samples)||samples<1||samples>5||!integer(maxBytes)||!integer(totalBytes)||BigInt(maxBytes)<1n||BigInt(totalBytes)<1n) throw new Error('Invalid benchmark limits');
  if(!Array.isArray(ids)||!ids.length||new Set(ids).size!==ids.length||ids.some(id=>!Object.hasOwn(queries,id))) throw new Error('Unknown or repeated reviewed query');
  let reserved=0n;
  const results={};
  for(const id of ids) {
    const sql=queries[id];
    const measured=recording.queries[id];
    if(measured?.sql!==sql||!integer(measured.bytes)) throw new Error('Record the exact SQL before benchmarking '+id);
    if(BigInt(measured.bytes)>BigInt(maxBytes)) {results[id]={status:'skipped',reason:'Dry-run estimate exceeds the per-run cap.'};continue;}
    const runs=[];
    results[id]={status:'complete',runs};
    for(let sample=0;sample<samples;sample++) {
      if(reserved+BigInt(maxBytes)>BigInt(totalBytes)) {results[id].status='budget-limited';break;}
      reserved+=BigInt(maxBytes);
      onProgress({id,sample:sample+1,samples});
      const started=performance.now();
      let job;
      try {
        [job]=await client.createQueryJob({query:sql,useLegacySql:false,useQueryCache:false,location:'US',maximumBytesBilled:maxBytes,jobTimeoutMs:30000});
        const [rows,next,response]=await job.getQueryResults({maxResults:100,autoPaginate:false,wrapIntegers:true});
        const clientMs=Math.round(performance.now()-started);
        if(next?.pageToken||response?.pageToken) throw new Error('Partial result');
        const [metadata]=await job.getMetadata();
        if(metadata.status?.state!=='DONE'||metadata.status.errorResult) throw new Error('Unfinished or failed job');
        const s=metadata.statistics??{},q=s.query??{},normalized=plain(rows);
        const output=normalized.slice(0,3).map(row=>Object.fromEntries(Object.entries(row).filter(([name])=>previewFields.has(name)))).filter(row=>Object.keys(row).length);
        runs.push({jobMs:elapsed(s.endTime,s.startTime),queueMs:elapsed(s.startTime,s.creationTime),clientMs,
          processedBytes:integer(q.totalBytesProcessed),billedBytes:integer(q.totalBytesBilled),slotMs:integer(q.totalSlotMs??s.totalSlotMs),
          cacheHit:typeof q.cacheHit==='boolean'?q.cacheHit:null,rowCount:rows.length,
          resultDigest:createHash('sha256').update(JSON.stringify(normalized)).digest('hex'),output,
          stages:publicStages(q.queryPlan)});
      } catch {
        if(job?.cancel) await job.cancel().catch(()=>{});
        results[id].status='failed';results[id].reason='Execution failed or reached a limit. No runtime was fabricated.';
        break;
      }
    }
  }
  return {capturedAt:new Date().toISOString(),samples,maximumBytesBilled:maxBytes,totalReservationLimit:totalBytes,reservedBytes:reserved.toString(),
    useQueryCache:false,jobTimeoutMs:30000,resultDigestFormat:'decimal-text-json-v2',order:'sequential, query then repetition',results};
}
