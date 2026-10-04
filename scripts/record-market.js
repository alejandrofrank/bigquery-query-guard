import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {marketSpecs} from '../examples/market-specs.js';

// Local-only capture: never write a private warehouse recording into this repo.
export async function recordMarket(client,{project,output,onProgress=()=>{}}) {
  if(!/^[a-z][a-z0-9-]{4,62}$/.test(project)) throw new Error('Invalid project');
  const repo=fileURLToPath(new URL('../',import.meta.url)), target=resolve(output);
  if(target.startsWith(resolve(repo))) throw new Error('Keep warehouse recordings outside the public repository');
  const runOptions={location:'US',useLegacySql:false,useQueryCache:false,maximumBytesBilled:'100000000',jobTimeoutMs:30000};
  const [dateRows]=await client.query({...runOptions,query:`SELECT MAX(partition_id) AS day FROM \`${project}.raw_supermarket.INFORMATION_SCHEMA.PARTITIONS\` WHERE table_name = 'products' AND REGEXP_CONTAINS(partition_id, r'^\\d{8}$')`});
  const partition=dateRows[0]?.day;
  if(!/^\d{8}$/.test(partition)) throw new Error('No dated product partitions');
  const day=partition.slice(0,4)+'-'+partition.slice(4,6)+'-'+partition.slice(6);
  const specs=marketSpecs(day), data={kind:'local-bakiano-warehouse',capturedAt:new Date().toISOString(),location:'US',useQueryCache:false,...specs,queries:{},sources:{}};
  for(const [id,sql] of Object.entries(specs.queries)) {
    const [job]=await client.createQueryJob({...runOptions,query:sql.replaceAll('YOUR_PROJECT',project),dryRun:true});
    const q=job.metadata.statistics.query, bytes=job.metadata.statistics.totalBytesProcessed;
    if(typeof bytes!=='string'||!/^\d+$/.test(bytes)) throw new Error('Missing estimate');
    data.queries[id]={sql,bytes,schema:q.schema.fields.map(f=>({name:f.name,type:f.type}))};
  }
  for(const name of ['raw_supermarket.products','enriched_supermarket.products']) {
    const [dataset,table]=name.split('.'); const [metadata]=await client.dataset(dataset).table(table).getMetadata();
    data.sources['YOUR_PROJECT.'+name]={type:metadata.type,partitioning:metadata.timePartitioning?{type:metadata.timePartitioning.type,field:metadata.timePartitioning.field??null}:null};
  }
  const results={};let reserved=0n;
  for(const [id,query] of Object.entries(data.queries)) {
    const cap=['100000000','150000000','1000000000'].find(n=>BigInt(query.bytes)<=BigInt(n));
    if(!cap){results[id]={status:'skipped',reason:'Dry-run estimate exceeds the 1 GB recording cap.'};continue;}
    const runs=[];results[id]={status:'complete',runs};
    for(let n=0;n<3;n++) {
      if(reserved+BigInt(cap)>12000000000n){results[id].status='budget-limited';break;}
      reserved+=BigInt(cap);onProgress(id+' · sample '+(n+1)+'/3');let job;
      const start=performance.now();
      try {
        [job]=await client.createQueryJob({...runOptions,maximumBytesBilled:cap,query:query.sql.replaceAll('YOUR_PROJECT',project)});
        const [rows,next,response]=await job.getQueryResults({autoPaginate:false,maxResults:30,wrapIntegers:true});
        if(next?.pageToken||response?.pageToken) throw new Error('Partial output');
        const clientMs=Math.round(performance.now()-start),[metadata]=await job.getMetadata();
        if(metadata.status.state!=='DONE'||metadata.status.errorResult) throw new Error('Failed execution');
        const s=metadata.statistics,q=s.query;
        const normalize=v=>v&&typeof v==='object'?'value' in v?normalize(v.value):Array.isArray(v)?v.map(normalize):Object.fromEntries(Object.keys(v).sort().map(k=>[k,normalize(v[k])])):v;
        const normal=normalize(rows);
        const output=normal.slice(0,3).map(row=>Object.fromEntries(Object.entries(row).filter(([k])=>['observations','chains','classified','source','product_name','price_current'].includes(k)))).filter(row=>Object.keys(row).length);
        if(id==='selectedColumns'&&n===0) data.input={name:'Leche Carabobo across chains',date:day,rows:normal.map(row=>({source:row.source,product_name:row.product_name,price_current:row.price_current})),note:'At most 20 latest-day listings from the frozen subset. The queries filter milk names in our partitioned warehouse; scan bytes describe warehouse reads, not the size of this preview. Prices are as scraped, not normalized USD. Packages can differ.'};
        const elapsed=(a,b)=>/^\d+$/.test(a)&&/^\d+$/.test(b)&&BigInt(a)>=BigInt(b)?Number(BigInt(a)-BigInt(b)):null;
        runs.push({maximumBytesBilled:cap,jobMs:elapsed(s.endTime,s.startTime),queueMs:elapsed(s.startTime,s.creationTime),clientMs,processedBytes:q.totalBytesProcessed??null,billedBytes:q.totalBytesBilled??null,slotMs:q.totalSlotMs??null,cacheHit:q.cacheHit??null,rowCount:rows.length,resultDigest:createHash('sha256').update(JSON.stringify(normal)).digest('hex'),output,stages:(q.queryPlan??[]).map(p=>({id:p.id,operations:[...new Set((p.steps??[]).map(step=>step.kind))],recordsRead:p.recordsRead??null,recordsWritten:p.recordsWritten??null,shuffleBytes:p.shuffleOutputBytes??null,spilledBytes:p.shuffleOutputBytesSpilled??null,slotMs:p.slotMs??null}))});
      } catch {if(job?.cancel)await job.cancel().catch(()=>{});results[id].status='failed';results[id].reason='Execution failed or exceeded a limit; runtime remains unknown.';break;}
    }
  }
  data.benchmarks={capturedAt:new Date().toISOString(),samples:3,maximumBytesBilled:'1000000000',totalReservationLimit:'12000000000',reservedBytes:String(reserved),results};
  if(!data.input?.rows?.length) throw new Error('No input preview captured; previous recording preserved');
  await writeFile(target,JSON.stringify(data,null,2));
  return data;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(process.argv.slice(2).length!==1||process.argv[2]!=='--benchmark') throw new Error('This recorder executes bounded queries. Explicitly pass --benchmark.');
  if(!process.env.GOOGLE_CLOUD_PROJECT||!process.env.LAB_RECORDING_FILE) throw new Error('Set GOOGLE_CLOUD_PROJECT and LAB_RECORDING_FILE outside this repo');
  const require=createRequire(import.meta.url),{BigQuery}=require(process.env.LAB_SDK_PATH??'@google-cloud/bigquery');
  const data=await recordMarket(new BigQuery({projectId:process.env.GOOGLE_CLOUD_PROJECT}),{project:process.env.GOOGLE_CLOUD_PROJECT,output:process.env.LAB_RECORDING_FILE,onProgress:console.log});
  console.log('Captured '+data.experiments.length+' cases and a curated listing preview locally. No project ID, job IDs or credentials saved.');
}
