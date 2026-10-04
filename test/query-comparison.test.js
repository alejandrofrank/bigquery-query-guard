import test from 'node:test';
import assert from 'node:assert/strict';
import {comparisonFor,relativeChange} from '../examples/query-comparison.js';
import {measurements} from '../examples/query-lab.js';
test('a lower scan estimate does not imply a faster query',()=>{
  const result=comparisonFor('summary');
  assert.ok(result.scanChange<0);
  assert.ok(result.timeChange>0);
  assert.equal(result.result,'equal');
  assert.equal(result.versions[0].output[0].transactions,result.versions[1].output[0].transactions);
});
test('different answers and unavailable measurements remain explicit',()=>{
  assert.equal(comparisonFor('cross').result,'different');
  const unmeasured=comparisonFor('summary',6.25,{queries:measurements.queries});
  assert.equal(unmeasured.timeChange,null);
  assert.equal(unmeasured.versions[0].billedCost,null);
  assert.equal(unmeasured.result,'not-verified');
  assert.deepEqual(unmeasured.versions[0].output,[]);
  assert.equal(relativeChange(0,1),null);
  assert.equal(relativeChange(0,0),0);
  assert.equal(relativeChange(null,10),null);
});
