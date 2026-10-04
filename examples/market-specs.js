// Application patterns adapted from Bakiano's partitioned supermarket warehouse.
// Project IDs, credentials and production observations are supplied locally.
export function marketSpecs(day) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('A recorded data date is required');
  const raw='`YOUR_PROJECT.raw_supermarket.products`', dim='`YOUR_PROJECT.enriched_supermarket.products`';
  const date="DATE '"+day+"'", today='ingestion_date = '+date;
  const subset="LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'";
  const count=where=>`SELECT COUNT(*) AS observations, COUNT(DISTINCT source) AS chains\nFROM ${raw}\nWHERE ${where}\n  AND ${subset};`;
  const latestSubquery=count(`ingestion_date = (SELECT MAX(ingestion_date) FROM ${raw})`), latestBound=count(today);
  const history=count(`ingestion_date BETWEEN DATE_SUB(${date}, INTERVAL 29 DAY) AND ${date}`);
  const allColumns=`SELECT *\nFROM ${raw}\nWHERE ${today}\n  AND ${subset}\nORDER BY source, product_id\nLIMIT 20;`;
  const selectedColumns=allColumns.replace('SELECT *','SELECT source, product_name, price_current');
  const join=id=>`SELECT COUNT(*) AS observations, COUNTIF(e.schema_version = 4) AS classified\nFROM ${raw} p\nLEFT JOIN ${dim} e\n  ON p.product_id = e.product_id${id?' AND p.source = e.source':''}\nWHERE p.${today}\n  AND LOWER(p.product_name) LIKE '%leche%' AND LOWER(p.product_name) LIKE '%carabobo%';`;
  const union=distinct=>`WITH milk AS (\n  SELECT source, product_id FROM ${raw}\n  WHERE ${today}\n    AND ${subset}\n), listings AS (\n  SELECT * FROM milk\n  UNION ${distinct?'DISTINCT':'ALL'}\n  SELECT * FROM milk\n)\nSELECT COUNT(*) AS observations FROM listings;`;
  const cte=`WITH today AS (\n  SELECT source, product_id FROM ${raw}\n  WHERE ${today}\n    AND ${subset}\n)\n`;
  const repeated=cte+'SELECT (SELECT COUNT(*) FROM today) AS observations,\n  (SELECT COUNT(DISTINCT source) FROM today) AS chains;';
  const once=cte+'SELECT COUNT(*) AS observations, COUNT(DISTINCT source) AS chains\nFROM today;';
  const queries={latestSubquery,latestBound,history,allColumns,selectedColumns,fewerRows:allColumns.replace('LIMIT 20','LIMIT 5'),dateFunction:count(`FORMAT_DATE('%Y-%m-%d', ingestion_date) = '${day}'`),joinId:join(false),joinSource:join(true),unionAll:union(false),unionDistinct:union(true),cteRepeated:repeated,cteOnce:once};
  const make=(id,label,question,variants,choices,change,meaning,maxRows=[1,1])=>({id,label,question,variants,choices,maxRows,baseline:variants[0],group:'market',lesson:meaning,tradeoff:change,docs:'https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute',context:{data:'Frozen Bakiano subset · Leche Carabobo listings · data date '+day,change,meaning}});
  const experiments=[
    make('latest','Latest-day lookup','How many Leche Carabobo observations and chains are in the latest loaded day?',['latestSubquery','latestBound'],['Find latest day inside query','Bind the resolved data date'],'Compare MAX(ingestion_date) inside the query with a date resolved before the price query, as our app does.','Both request the same milk subset and day. Resolving the date first lets the main query target one partition. The separate date lookup has its own cost.'),
    make('market-window','Price history window','How much history do we read for one day versus a 30-day chart?',['history','latestBound'],['30 days of observations','Latest day only'],'Read 30 daily partitions or only the latest loaded day.','The totals cover different time windows. The smaller query cannot replace a 30-day price chart.'),
    make('market-columns','Fields for a price card','Which fields should a supermarket price card request?',['allColumns','selectedColumns'],['Full raw product row','Name, chain and scraped price'],'Keep the same date, ordering and 20-row limit; select only the three fields needed by the card.','Raw prices are as scraped, with vendor-dependent currencies. These are not comparable USD prices until our currency conversion layer runs.',[20,20]),
    make('market-join','Enrichment identity','How should a scraped listing join its enrichment record?',['joinId','joinSource'],['Product ID alone','Chain plus product ID'],'Include the source in the enrichment join, as the application does.','A listing belongs to a source and product ID. A faster join is not useful if it links the wrong enrichment record.'),
    make('market-union','Repeated source batches','What happens if the same milk listing batch enters twice?',['unionAll','unionDistinct'],['Keep both copies','Deduplicate selected identities'],'Combine two copies of the same source batch with UNION ALL or UNION DISTINCT.','DISTINCT removes repeated selected identities. It does not decide whether listings across different chains are the same real-world product.'),
    make('market-cte','Repeated query expression','Can we calculate observation and chain counts in one aggregate?',['cteRepeated','cteOnce'],['Two nested scalar queries','One aggregate'],'Reuse the same date-filtered WITH expression in two scalar subqueries or calculate both counts together.','Both target the same counts. WITH does not guarantee an intermediate cache; inspect the measured execution stages.'),
    make('market-limit','Preview size','Does showing five milk listings instead of twenty reduce the scan?',['allColumns','fewerRows'],['20 preview rows','5 preview rows'],'Keep the same subset, day and selected fields; reduce only the returned row limit.','LIMIT controls the preview size. It does not promise less reading.',[20,5]),
    make('market-predicate','Partition predicate','How do two date predicates affect reading the same milk subset?',['dateFunction','latestBound'],['Format the partition date','Direct date equality'],'Compare FORMAT_DATE on ingestion_date with direct date equality.','Both request the same data date. Use the recorded estimate to check pruning rather than guessing from the SQL syntax.'),
  ];
  return {queries,experiments,groups:[{id:'market',label:'Bakiano warehouse'}]};
}
