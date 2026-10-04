import { measurements } from '../data/query-estimates.js';
import { createQueryGuard } from '../src/index.js';

export const experiments = [
  { id:'limit', label:'LIMIT', title:'100 rows can still read gigabytes.', question:'Preview a few taxi trips.', baseline:'taxiAll', variants:['taxiAll','taxiTen'], choices:['100 rows','10 rows'], badge:'Output ≠ scan',
    lesson:'LIMIT controls how many rows come back. On this table, both versions read the same selected columns.', tradeoff:'The preview gets shorter. The scan estimate stays the same.', changed:[3], maxRows:[100,10], source:'taxi', docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute#avoid_select_' },
  { id:'columns', label:'Columns', title:'Read the fields your screen uses.', question:'Get the vendor, pickup time and total fare.', baseline:'taxiAll', variants:['taxiAll','taxiFocused'], choices:['All 20 columns','Only 3 useful fields'], badge:'Keep the useful fields',
    lesson:'Compare reading all columns with reading only the three fields the screen needs. Check the byte estimate alongside the output schema.', tradeoff:'Fare breakdowns and pickup locations are no longer in the result. Add them back when your question needs them.', changed:[1], maxRows:[100,100], source:'taxi', docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute' },
  { id:'dates', label:'Dates', title:'A filter can shrink the answer, not the scan.', question:'Preview taxi trips from 1 January 2022.', baseline:'taxiFocused', variants:['taxiFocused','taxiDay'], choices:['No date filter','One day'], badge:'Storage layout matters',
    lesson:'This public taxi table is not date-partitioned. Filtering pickup time changes the requested rows but does not reduce the recorded scan estimate.', tradeoff:'The one-day query answers a narrower question. A WHERE clause alone is not proof of a cheaper read.', changed:[3,4], maxRows:[100,100], source:'taxi', docs:'https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables' },
  { id:'time', label:'Time slice', title:'Give the planner a time boundary.', question:'Inspect Bitcoin transaction IDs, timestamps and values.', baseline:'bitcoinAll', variants:['bitcoinAll','bitcoinDay'], choices:['All history','1 January 2024'], badge:'A smaller time slice',
    lesson:'The month and day predicates reduce the recorded estimate for this public view. Compare that with the taxi table, where the date filter saved nothing.', tradeoff:'You now request one day rather than all history. The public endpoint is a view; its physical partition layout is not exposed in this lab.', changed:[3,4,5], maxRows:[100,100], source:'bitcoin', docs:'https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables' },
  { id:'summary', label:'Summary', title:'Keep the answer. Change the level of detail.', question:'How many Bitcoin transactions occurred on 1 January 2024?', baseline:'transactionCount', variants:['transactionCount','blockCount'], choices:['Count transactions','Sum block counts'], badge:'Verified equal count',
    lesson:'Counting transactions and summing block-level counts answer the same question. Compare the recorded check below; a summary is not automatically a dramatic saving.', tradeoff:'Block-level data can answer this count. It cannot supply the individual transaction values. Refresh timing can also affect agreement.', changed:[1,2,3,4,5], maxRows:[1,1], source:'blocks', docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute' },
];
export function selection(id='limit',variant=0) {
  const experiment=experiments.find(e=>e.id===id);
  if(!experiment || !Number.isInteger(variant) || variant<0 || variant>1) throw new Error('Unknown reviewed query');
  const queryId=experiment.variants[variant], query=measurements.queries[queryId], baseline=measurements.queries[experiment.baseline];
  if(!query || query.sql.trim()==='') throw new Error('Missing recorded query');
  const reduction=(1-Number(query.bytes)/Number(baseline.bytes))*100;
  return {experiment,variant,queryId,query,baseline,reduction,recordedAt:measurements.capturedAt};
}
export async function checkLimit(id,variant,limit) {
  if(!['100000000','1000000000','10000000000','200000000000'].includes(limit)) throw new Error('Unknown byte cap');
  const selected=selection(id,variant); let executions=0;
  const guard=createQueryGuard({authorize:async r=>r.principal==='local-lab',engine:{namespace:'recorded-estimates-local-adapter',
    async estimate(){return selected.query.bytes;},
    async execute(){executions++;return {rows:selected.query.schema,billedBytes:null,nativeCacheHit:false};}
  }});
  try {
    const result=await guard.run({principal:'local-lab',queryId:selected.queryId,sql:selected.query.sql,params:{},location:'US',scope:{kind:'shared',id:'public-recordings'},publication:measurements.capturedAt,maxBytesBilled:limit});
    return {allowed:true,executions,trace:result.trace};
  } catch(error) {
    if(error.name!=='QueryLimitError') throw error;
    return {allowed:false,executions,estimatedBytes:error.estimatedBytes,limitBytes:error.limitBytes};
  }
}
export { measurements };
