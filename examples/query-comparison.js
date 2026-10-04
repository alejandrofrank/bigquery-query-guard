import {experiments,measurements} from './query-lab.js';
import {pricing,processingCost,runtimeStats,compareResults} from './query-metrics.js';

// Context describes the reviewed SQL, not an inferred physical execution plan.
const context={
  limit:{data:'New York taxi trips · 2022 · unpartitioned table',change:'Return 10 rows instead of 100, keeping all 20 selected columns.',meaning:'Fewer returned rows do not mean less data read.'},
  columns:{data:'New York taxi trips · 2022 · unpartitioned table',change:'Select three needed columns instead of all 20. Keep the 100-row limit.',meaning:'Removing columns changes what BigQuery needs to read.'},
  dates:{data:'New York taxi trips · 2022 · unpartitioned table',change:'Add a one-day pickup-time filter to the same three-column query.',meaning:'The date filter narrows the answer. This table has no date partitions to skip.'},
  time:{data:'Public Bitcoin transaction view · all history versus 1 January 2024 UTC',change:'Add month and day predicates while keeping the same three selected fields.',meaning:'The time window narrows both the requested history and the recorded scan estimate.'},
  summary:{data:'Public Bitcoin transaction and block views · 1 January 2024 UTC',change:'Count individual transactions, or add the transaction count already stored on each block.',meaning:'Both methods target the same count. Fewer bytes do not guarantee a shorter runtime.'},
  partitions:{data:'Google Trends top_terms · daily partitions on refresh_date',change:'Read one refresh date instead of seven: 1 October versus 25 September–1 October 2026.',meaning:'Less history means fewer date partitions. The two totals cover different time windows.'},
  predicate:{data:'Google Trends top_terms · refresh_date = 1 October 2026',change:'Compare FORMAT_DATE on the partition key with direct DATE equality.',meaning:'Both request the same date. The predicate changes the recorded scan estimate.'},
  union:{data:'Public Bitcoin block view · the same day of blocks supplied twice',change:'Keep both copies with UNION ALL, or remove duplicate selected rows with UNION DISTINCT.',meaning:'Deduplication changes the answer. These two queries are not interchangeable.'},
  joins:{data:'Public Bitcoin transaction and block views · 1 January 2024 UTC',change:'Join individual transaction rows, or group their totals by block before joining.',meaning:'Both return 100 ordered block totals in this capture. Compare compute work as well as reading.'},
  correlated:{data:'Public Bitcoin transactions · nested output arrays · 1 January 2024 UTC',change:'Sum each transaction’s output array in a nested query, or flatten the arrays with UNNEST.',meaning:'The target total is the same. BigQuery chooses the physical execution strategy.'},
  cross:{data:'Public Bitcoin block view · 1 January 2024 UTC',change:'Pair every block with every block, or only pair blocks with the same number.',meaning:'A Cartesian product and a keyed join answer different questions, even if both return one count.'},
  cte:{data:'Public Bitcoin block view · 1 January 2024 UTC',change:'Reference one WITH expression in two scalar subqueries, or calculate both metrics in one aggregate.',meaning:'WITH names a query expression. It does not promise a cached intermediate table.'},
};
export function relativeChange(original,current) {
  if(!Number.isFinite(original)||!Number.isFinite(current)||original<0||current<0)return null;
  if(original===0)return current===0?0:null;
  return (current/original-1)*100;
}
export function comparisonFor(id,rate=pricing.usdPerTiB,recording=measurements,cases=experiments) {
  const experiment=cases.find(item=>item.id===id);
  if(!experiment)throw new Error('Unknown reviewed query');
  const versions=experiment.variants.map((queryId,index)=>{
    const query=recording.queries[queryId];
    if(!query)throw new Error('Missing recorded query');
    const runtime=runtimeStats(queryId,recording);
    return {queryId,label:experiment.choices[index],query,runtime,
      estimatedCost:processingCost(query.bytes,rate),
      billedCost:processingCost(runtime.billedBytes===null?null:String(runtime.billedBytes),rate),
      output:runtime.representative?.output??[]};
  });
  return {experiment,context:experiment.context??context[id],versions,
    scanChange:relativeChange(Number(versions[0].query.bytes),Number(versions[1].query.bytes)),
    timeChange:relativeChange(versions[0].runtime.jobMs,versions[1].runtime.jobMs),
    result:compareResults(...experiment.variants,recording)};
}
