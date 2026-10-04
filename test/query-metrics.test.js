import test from 'node:test';
import assert from 'node:assert/strict';
import {processingCost,median,runtimeStats,compareResults} from '../examples/query-metrics.js';
test('cost converts binary TiB and preserves zero or unknown observations',()=>{
  assert.equal(processingCost(String(2**40),6.25),6.25);
  assert.equal(processingCost('0'),0);
  assert.equal(processingCost(null),null);
  assert.equal(processingCost(undefined),null);
  assert.throws(()=>processingCost('12',NaN),/Invalid/);
  assert.throws(()=>processingCost('-1'),/Invalid/);
});
test('runtime summaries use real uncached observations, including an outlier and missing billing',()=>{
  const runs=[100,110,900].map(jobMs=>({jobMs,cacheHit:false,clientMs:jobMs+50,billedBytes:null,slotMs:'500'}));
  runs.push({jobMs:0,cacheHit:true,clientMs:0,billedBytes:'0'});
  const r=runtimeStats('q',{benchmarks:{results:{q:{status:'complete',runs}}}});
  assert.equal(r.jobMs,110);assert.equal(r.maxMs,900);assert.equal(r.count,3);
  assert.equal(r.clientMs,160);assert.equal(r.billedBytes,null);assert.equal(r.representative.jobMs,110);
  assert.equal(runtimeStats('missing',{queries:{}}).jobMs,null);
  assert.equal(median([null,NaN]),null);assert.equal(median([10,20]),15);
});
test('equality needs completed recordings and valid full-result fingerprints',()=>{
  const result=digest=>({status:'complete',runs:[{cacheHit:false,jobMs:100,resultDigest:digest}]});
  const recording={benchmarks:{results:{a:result('a'.repeat(64)),b:result('a'.repeat(64))}}};
  assert.equal(compareResults('a','b',recording),'equal');
  recording.benchmarks.results.b.runs[0].resultDigest='b'.repeat(64);
  assert.equal(compareResults('a','b',recording),'different');
  recording.benchmarks.results.b.runs[0].resultDigest=undefined;
  assert.equal(compareResults('a','b',recording),'not-verified');
  recording.benchmarks.results.b.status='failed';
  assert.equal(compareResults('a','b',recording),'not-verified');
});
