import test from 'node:test';
import assert from 'node:assert/strict';
import { experiments, selection, checkLimit, measurements } from '../examples/query-lab.js';
import { queries } from '../examples/query-specs.js';
import { recordEstimates, verifySummary } from '../scripts/record-estimates.js';

test('published estimates stay attached to the exact SQL that was measured', () => {
  assert.deepEqual(Object.keys(measurements.queries), Object.keys(queries));
  for (const [id, sql] of Object.entries(queries)) {
    const recording = measurements.queries[id];
    assert.equal(recording.sql, sql, id+': re-record after changing SQL');
    assert.match(recording.bytes, /^\d+$/);
    assert.ok(recording.schema.length > 0);
  }
  for (const experiment of experiments) {
    for (const variant of [0, 1]) assert.ok(Number.isFinite(selection(experiment.id, variant).reduction));
  }
  assert.equal(measurements.queries.taxiAll.bytes, measurements.queries.taxiTen.bytes);
  assert.equal(measurements.queries.taxiFocused.bytes, measurements.queries.taxiDay.bytes);
});

test('lab invokes the real guard: blocked estimates never reach the local execution adapter', async () => {
  const blocked = await checkLimit('limit', 0, '100000000');
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.executions, 0);
  assert.equal(blocked.estimatedBytes, measurements.queries.taxiAll.bytes);
  const allowed = await checkLimit('columns', 1, '1000000000');
  assert.equal(allowed.allowed, true);
  assert.equal(allowed.executions, 1);
  assert.equal(allowed.trace.billedBytes, null);
  assert.throws(()=>selection('not-a-query'), /Unknown/);
  assert.throws(()=>selection('limit', 2), /Unknown/);
  await assert.rejects(checkLimit('limit', 0, '9000000000000'), /Unknown byte cap/);
});

test('recorder only submits dry runs and only publishes allowed statistics', async () => {
  const calls = [];
  const data = await recordEstimates({ async createQueryJob(options) {
    calls.push(options);
    return [{metadata:{id:'private-job',configuration:{query:{query:options.query}},statistics:{
      totalBytesProcessed:'100',query:{schema:{fields:[{name:'n',type:'INTEGER',description:'not published'}]}}
    }},getQueryResults(){throw new Error('Must never execute a default recording');}}];
  }});
  assert.equal(calls.length, Object.keys(queries).length);
  for (const call of calls) {
    assert.equal(call.dryRun, true);
    assert.equal(call.useQueryCache, false);
  }
  assert.equal(JSON.stringify(data).includes('private-job'), false);
  assert.equal(JSON.stringify(data).includes('not published'), false);
  assert.deepEqual(data.queries.taxiAll.schema, [{name:'n',type:'INTEGER'}]);
  await assert.rejects(recordEstimates({async createQueryJob(){return [{metadata:{statistics:{}}}];}}), /Missing estimate/);
});

test('optional verification caps both real aggregate executions and preserves unknown billing', async () => {
  const calls = [];
  const data = await verifySummary({async createQueryJob(options) {
    calls.push(options);
    return [{async getQueryResults(options) {
      assert.equal(options.autoPaginate, false);
      return [[{transactions:{value:'657752'}}]];
    },async getMetadata(){return [{statistics:{query:{}}}];}}];
  }});
  assert.equal(calls.length, 2);
  for (const call of calls) {
    assert.equal(call.maximumBytesBilled, '50000000');
    assert.equal(call.useQueryCache, false);
    assert.equal(call.dryRun, undefined);
  }
  assert.equal(data.equal, true);
  assert.equal(data.results.transactionCount.billedBytes, null);
});
