import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {marketSpecs} from '../examples/market-specs.js';
import {measurements,experiments,checkLimit} from '../examples/market-lab.js';
import {comparisonFor} from '../examples/query-comparison.js';
import {recordMarket} from '../scripts/record-market.js';

test('Bakiano cases replay exact captured SQL, subset and results without a warehouse client',async()=>{
  const specs=marketSpecs(measurements.input.date);
  for(const [id,sql] of Object.entries(specs.queries))assert.equal(measurements.queries[id].sql,sql,id);
  assert.equal(measurements.input.rows.length,4);
  for(const row of measurements.input.rows)assert.deepEqual(Object.keys(row).sort(),['price_current','product_name','source']);
  const latest=comparisonFor('latest',6.25,measurements,experiments);
  assert.equal(latest.result,'equal');assert.ok(latest.scanChange<0);
  assert.equal(latest.versions[0].output[0].observations,latest.versions[1].output[0].observations);
  assert.equal(comparisonFor('market-union',6.25,measurements,experiments).result,'different');
  const blocked=await checkLimit('latest',0,'100000000');assert.equal(blocked.executions,0);
  const allowed=await checkLimit('latest',1,'100000000');assert.equal(allowed.allowed,true);assert.equal(allowed.trace.billedBytes,null);
});

test('warehouse recording reserves adaptive caps and excludes identity, IDs and extra listing fields',async()=>{
  const dir=await mkdtemp(join(tmpdir(),'market-capture-'));const calls=[];
  try {
    const client={
      async query(){return [[{day:'20261004'}]];},
      dataset(){return {table(){return {async getMetadata(){return [{type:'TABLE',timePartitioning:{type:'DAY',field:'ingestion_date'},id:'private-source'}];}};}};},
      async createQueryJob(options){calls.push(options);const wide=options.query.includes('MAX(ingestion_date)')||options.query.includes('FORMAT_DATE')||options.query.includes('LEFT JOIN'),bytes=wide?'800000000':'120000000';return [{
        metadata:{statistics:{totalBytesProcessed:bytes,query:{schema:{fields:[{name:'observations',type:'INTEGER',description:'private-description'}]}}}},
        async getQueryResults(){return [[{observations:{value:'4'},chains:{value:'3'},source:'Market A',product_name:'Sample milk',price_current:10,product_id:'private-id',customer_email:'private-email'}],null,{}];},
        async getMetadata(){return [{id:'private-job',status:{state:'DONE'},statistics:{creationTime:'1',startTime:'2',endTime:'3',query:{totalBytesProcessed:bytes,totalBytesBilled:'0',totalSlotMs:'1',cacheHit:false}}}];},
      }];},
    };
    const target=join(dir,'recording.json');const data=await recordMarket(client,{project:'test-project',output:target});
    const captured=await readFile(target,'utf8');
    for(const text of ['test-project','private-id','private-email','private-job','private-source','private-description'])assert.equal(captured.includes(text),false,text);
    assert.ok(BigInt(data.benchmarks.reservedBytes)<=BigInt(data.benchmarks.totalReservationLimit));
    const executions=calls.filter(c=>!c.dryRun);assert.ok(executions.some(c=>c.maximumBytesBilled==='1000000000'));assert.ok(executions.some(c=>c.maximumBytesBilled==='150000000'));
    assert.ok(executions.every(c=>c.useQueryCache===false&&c.jobTimeoutMs===30000));
    assert.equal(data.benchmarks.results.latestBound.runs[0].billedBytes,'0');
    assert.ok(Object.values(data.benchmarks.results).some(r=>r.status==='budget-limited'));
    await assert.rejects(recordMarket(client,{project:'test-project',output:fileURLToPath(new URL('../data/private.json',import.meta.url))}),/outside/);
  } finally {await rm(dir,{recursive:true,force:true});}
});
