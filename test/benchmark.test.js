import test from 'node:test';
import assert from 'node:assert/strict';
import {queries} from '../examples/query-specs.js';
import {benchmarkQueries} from '../scripts/benchmark-queries.js';
const recording={queries:Object.fromEntries(Object.entries(queries).map(([id,sql])=>[id,{sql,bytes:'50'}]))};
function fixture({failed=false,rows=[{transactions:{value:'657752'}}]}={}) {
  const calls=[];let cancelled=0;
  return {calls,cancelled:()=>cancelled,client:{async createQueryJob(options){
    calls.push(options);
    return [{async getQueryResults(){if(failed)throw new Error('private provider message');return [rows,null,{}];},
      async getMetadata(){return [{id:'private-job',status:{state:'DONE'},statistics:{creationTime:'100',startTime:'110',endTime:'130',query:{totalBytesProcessed:'50',totalBytesBilled:'100',totalSlotMs:'500',cacheHit:false,queryPlan:[{id:'0',recordsRead:'2',recordsWritten:'1',steps:[{kind:'READ',substeps:['private physical table']}]}]}}}];},
      async cancel(){cancelled++;}}];
  }}};
}
test('benchmarks reserve hard caps before attempts, disable cache, and whitelist public metadata',async()=>{
  const f=fixture(),data=await benchmarkQueries(f.client,recording,{samples:3,maxBytes:'100',totalBytes:'300'});
  assert.equal(f.calls.length,3);assert.equal(data.reservedBytes,'300');
  for(const call of f.calls){assert.equal(call.maximumBytesBilled,'100');assert.equal(call.useQueryCache,false);assert.equal(call.jobTimeoutMs,30000);}
  const run=data.results.taxiAll.runs[0];
  assert.equal(run.jobMs,20);assert.equal(run.queueMs,10);assert.equal(run.billedBytes,'100');
  assert.equal(JSON.stringify(data).includes('private'),false);
  assert.equal(data.results.taxiTen.status,'budget-limited');
});
test('focused benchmarks only run reviewed IDs and normalize exact decimal results',async()=>{
  const f=fixture({rows:[{total_output:{c:[1,2,3,4],e:1,s:1,toFixed:()=> '12.34'}}]});
  const data=await benchmarkQueries(f.client,recording,{ids:['transactionCount'],samples:1,maxBytes:'100',totalBytes:'100'});
  assert.equal(f.calls.length,1);
  assert.deepEqual(Object.keys(data.results),['transactionCount']);
  assert.equal(data.results.transactionCount.runs[0].output[0].total_output,'12.34');
  await assert.rejects(benchmarkQueries(f.client,recording,{ids:['unreviewed']}),/reviewed query/);
  await assert.rejects(benchmarkQueries(f.client,recording,{ids:['blockCount','blockCount']}),/reviewed query/);
});
test('oversized and stale SQL never execute; failed jobs do not get a runtime',async()=>{
  const f=fixture({failed:true});
  const data=await benchmarkQueries(f.client,recording,{samples:3,maxBytes:'100',totalBytes:'100'});
  assert.equal(f.cancelled(),1);assert.equal(data.results.taxiAll.status,'failed');
  assert.deepEqual(data.results.taxiAll.runs,[]);assert.equal(data.reservedBytes,'100');
  const tooSmall=await benchmarkQueries(f.client,recording,{maxBytes:'1',totalBytes:'10'});
  assert.equal(tooSmall.reservedBytes,'0');
  await assert.rejects(benchmarkQueries(f.client,{queries:{}}),/exact SQL/);
});
