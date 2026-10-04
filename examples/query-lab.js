import { measurements } from '../data/query-estimates.js';
import { createQueryGuard } from '../src/index.js';

export const experiments = [
  { id:'limit', group:'scan', label:'LIMIT', title:'Row limits and scan size', question:'Does returning fewer taxi trips read less data?', baseline:'taxiAll', variants:['taxiAll','taxiTen'], choices:['100 rows','10 rows'], badge:'Output ≠ scan',
    lesson:'LIMIT controls how many rows come back. On this table, both versions read the same selected columns.', tradeoff:'The preview gets shorter. The scan estimate stays the same.', changed:[3], maxRows:[100,10], source:'taxi', docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute#avoid_select_' },
  { id:'columns', group:'scan', label:'Columns', title:'Column projection', question:'Get the vendor, pickup time and total fare.', baseline:'taxiAll', variants:['taxiAll','taxiFocused'], choices:['All 20 columns','Only 3 useful fields'], badge:'Output fields',
    lesson:'Compare reading all columns with reading only the three fields the screen needs. Check the byte estimate alongside the output schema.', tradeoff:'Fare breakdowns and pickup locations are no longer in the result. Add them back when your question needs them.', changed:[1], maxRows:[100,100], source:'taxi', docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute' },
  { id:'dates', group:'scan', label:'Unpartitioned', title:'Date filter on an unpartitioned table', question:'Preview taxi trips from 1 January 2022.', baseline:'taxiFocused', variants:['taxiFocused','taxiDay'], choices:['No date filter','One day'], badge:'Storage layout',
    lesson:'This public taxi table is not date-partitioned. Filtering pickup time changes the requested rows but does not reduce the recorded scan estimate.', tradeoff:'The one-day query answers a narrower question. A WHERE clause alone is not proof of a cheaper read.', changed:[3,4], maxRows:[100,100], source:'taxi', docs:'https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables' },
  { id:'time', group:'storage', label:'View predicates', title:'Time filtering through a public view', question:'Inspect Bitcoin transaction IDs, timestamps and values.', baseline:'bitcoinAll', variants:['bitcoinAll','bitcoinDay'], choices:['All history','1 January 2024'], badge:'Time scope',
    lesson:'The month and day predicates reduce the recorded estimate for this public view. Compare that with the taxi table, where the date filter saved nothing.', tradeoff:'You now request one day rather than all history. The public endpoint is a view; its physical partition layout is not exposed in this lab.', changed:[3,4,5], maxRows:[100,100], source:'bitcoin', docs:'https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables' },
  { id:'summary', group:'scan', label:'Summary', title:'Counting rows versus reading a summary', question:'How many Bitcoin transactions occurred on 1 January 2024?', baseline:'transactionCount', variants:['transactionCount','blockCount'], choices:['Count transactions','Sum block counts'], badge:'Compare counts',
    lesson:'Counting transactions and summing block-level counts answer the same question. Compare the recorded check below; a summary is not automatically a dramatic saving.', tradeoff:'Block-level data can answer this count. It cannot supply the individual transaction values. Refresh timing can also affect agreement.', changed:[1,2,3,4,5], maxRows:[1,1], source:'blocks', docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute' },
  {id:'partitions',group:'storage',label:'Partition window',title:'Reading one or seven date partitions',question:'Count Google Trends records and sum their scores.',baseline:'partitionWeek',variants:['partitionWeek','partitionDay'],choices:['Seven refresh dates','One refresh date'],badge:'DAY / refresh_date',
    lesson:'The source metadata identifies refresh_date as a daily partition key. Compare the seven-day and one-day scan estimates, then inspect measured runtime.',tradeoff:'A one-day result covers less history. Score sums are dataset aggregates, not absolute search volumes.',changed:[3],maxRows:[1,1],source:'trends',docs:'https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables'},
  {id:'predicate',group:'storage',label:'Partition predicate',title:'Filtering the partition column',question:'Request the same Google Trends refresh date using two predicates.',baseline:'partitionFunction',variants:['partitionFunction','partitionDay'],choices:['FORMAT_DATE on the key','Direct DATE equality'],badge:'Equivalent date predicate',
    lesson:'A transformed partition key can change what the planner can eliminate. Inspect these measured bytes rather than assuming every date expression prunes equally.',tradeoff:'Both predicates request the same day. The wider estimate is skipped by the bounded runtime recorder.',changed:[3],maxRows:[1,1],source:'trends',docs:'https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables'},
  {id:'union',group:'composition',label:'UNION',title:'UNION ALL versus UNION DISTINCT',question:'Combine the same day of Bitcoin blocks twice.',baseline:'unionAll',variants:['unionAll','unionDistinct'],choices:['Keep duplicate rows','Remove duplicate rows'],badge:'Result semantics',
    lesson:'UNION ALL keeps both copies. UNION DISTINCT removes duplicate selected rows. Compare output counts, scan estimates, slot time, and execution stages.',tradeoff:'These queries intentionally return different counts. Deduplication is required only when that is the desired meaning.',changed:[11],maxRows:[1,1],source:'blocks',docs:'https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/query-syntax#union'},
  {id:'joins',group:'composition',label:'JOIN',title:'Aggregating before a JOIN',question:'Count transactions and sum output values by Bitcoin block.',baseline:'joinRaw',variants:['joinRaw','joinAggregated'],choices:['Join transaction rows','Group before joining'],badge:'Comparable output',
    lesson:'Grouping transaction rows by block reduces the rows supplied to the join. A similar scan estimate does not guarantee similar compute work or runtime.',tradeoff:'The grouped path retains block-level totals but discards transaction-level detail. The captured output is limited to 100 ordered blocks.',changed:[],maxRows:[100,100],source:'blocks',docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute'},
  {id:'correlated',group:'composition',label:'Nested query',title:'Correlated aggregation versus UNNEST',question:'Sum the values stored in nested Bitcoin output arrays.',baseline:'correlatedSum',variants:['correlatedSum','unnestedSum'],choices:['Per-row nested SUM','Flatten with UNNEST'],badge:'Nested data',
    lesson:'The first SQL nests an aggregate over each transaction array. The second flattens output elements. BigQuery chooses the physical strategy; the plan is evidence, not a hand-drawn loop.',tradeoff:'Both request the same total for this day. Array expansion changes intermediate cardinality and can also affect NULL behavior in other queries.',changed:[],maxRows:[1,1],source:'bitcoin',docs:'https://docs.cloud.google.com/bigquery/docs/reference/standard-sql/subqueries'},
  {id:'cross',group:'composition',label:'CROSS JOIN',title:'Cartesian versus keyed JOIN',question:'Count possible pairs of Bitcoin blocks from the same day.',baseline:'crossJoin',variants:['crossJoin','keyedJoin'],choices:['Every block pair','Match block number'],badge:'Join cardinality',
    lesson:'The Cartesian query counts every combination. The keyed query counts matching numbers. A one-row aggregate can describe a much larger intermediate result; the optimizer may simplify the work.',tradeoff:'These answers have different meanings. A keyed join cannot replace an intentional Cartesian product just because it is smaller.',changed:[],maxRows:[1,1],source:'blocks',docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute'},
  {id:'cte',group:'composition',label:'CTE reuse',title:'Repeated CTE references',question:'Calculate a transaction count and mean block size for one day.',baseline:'cteRepeated',variants:['cteRepeated','cteOnePass'],choices:['Two scalar subqueries','One aggregate pass'],badge:'Optimizer behavior',
    lesson:'A WITH expression is not a promise of a cached intermediate table. Inspect the actual stage counts and runtime: the optimizer may combine repeated work or choose different plans.',tradeoff:'The outputs target the same metrics. Floating-point averages can vary slightly with aggregation order, so exact result fingerprints can differ.',changed:[],maxRows:[1,1],source:'blocks',docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute'},
];
export const groups=[{id:'scan',label:'Scan & output'},{id:'storage',label:'Partitions & storage'},{id:'composition',label:'Query structure'}];
export function selection(id='limit',variant=0,cases=experiments,recording=measurements) {
  const experiment=cases.find(e=>e.id===id);
  if(!experiment || !Number.isInteger(variant) || variant<0 || variant>1) throw new Error('Unknown reviewed query');
  const queryId=experiment.variants[variant], query=recording.queries[queryId], baseline=recording.queries[experiment.baseline];
  if(!query || query.sql.trim()==='') throw new Error('Missing recorded query');
  const reduction=(1-Number(query.bytes)/Number(baseline.bytes))*100;
  return {experiment,variant,queryId,query,baseline,reduction,recordedAt:recording.capturedAt};
}
export async function checkLimit(id,variant,limit,lab={experiments,measurements}) {
  if(!['100000000','1000000000','10000000000','200000000000'].includes(limit)) throw new Error('Unknown byte cap');
  const selected=selection(id,variant,lab.experiments,lab.measurements); let executions=0;
  const guard=createQueryGuard({authorize:async r=>r.principal==='local-lab',engine:{namespace:'recorded-estimates-local-adapter',
    async estimate(){return selected.query.bytes;},
    async execute(){executions++;return {rows:selected.query.schema,billedBytes:null,nativeCacheHit:false};}
  }});
  try {
    const result=await guard.run({principal:'local-lab',queryId:selected.queryId,sql:selected.query.sql,params:{},location:'US',scope:{kind:'shared',id:'recorded-lab'},publication:lab.measurements.capturedAt,maxBytesBilled:limit});
    return {allowed:true,executions,trace:result.trace};
  } catch(error) {
    if(error.name!=='QueryLimitError') throw error;
    return {allowed:false,executions,estimatedBytes:error.estimatedBytes,limitBytes:error.limitBytes};
  }
}
export { measurements };
