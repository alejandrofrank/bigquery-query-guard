const blocks = '`bigquery-public-data.crypto_bitcoin.blocks`';
const transactions = '`bigquery-public-data.crypto_bitcoin.transactions`';
const blockDay = 'FROM '+blocks+"\nWHERE timestamp_month = DATE('2024-01-01')\n  AND timestamp >= TIMESTAMP('2024-01-01')\n  AND timestamp < TIMESTAMP('2024-01-02')";
const transactionDay = 'FROM '+transactions+" t\nWHERE t.block_timestamp_month = DATE('2024-01-01')\n  AND t.block_timestamp >= TIMESTAMP('2024-01-01')\n  AND t.block_timestamp < TIMESTAMP('2024-01-02')";
const dayBlocks = 'WITH day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number, size, transaction_count\n  '+blockDay.replaceAll('\n','\n  ')+'\n)\n';
const txCTE = 'WITH day_transactions AS (\n  SELECT block_hash, output_value\n  '+transactionDay.replaceAll('\n','\n  ')+'\n), day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number\n  '+blockDay.replaceAll('\n','\n  ')+'\n)\n';
export const compositionQueries = {
  unionAll: dayBlocks+'SELECT COUNT(*) AS `rows`, SUM(transaction_count) AS transactions\nFROM (\n  SELECT block_hash, transaction_count FROM day_blocks\n  UNION ALL\n  SELECT block_hash, transaction_count FROM day_blocks\n);',
  unionDistinct: dayBlocks+'SELECT COUNT(*) AS `rows`, SUM(transaction_count) AS transactions\nFROM (\n  SELECT block_hash, transaction_count FROM day_blocks\n  UNION DISTINCT\n  SELECT block_hash, transaction_count FROM day_blocks\n);',
  joinRaw: txCTE+'SELECT b.block_number, COUNT(*) AS transactions,\n  SUM(t.output_value) AS total_output\nFROM day_transactions t\nJOIN day_blocks b USING (block_hash)\nGROUP BY b.block_number\nORDER BY b.block_number\nLIMIT 100;',
  joinAggregated: txCTE+', grouped_transactions AS (\n  SELECT block_hash, COUNT(*) AS transactions, SUM(output_value) AS total_output\n  FROM day_transactions\n  GROUP BY block_hash\n)\nSELECT b.block_number, t.transactions, t.total_output\nFROM grouped_transactions t\nJOIN day_blocks b USING (block_hash)\nORDER BY b.block_number\nLIMIT 100;',
  correlatedSum: 'SELECT SUM((\n  SELECT SUM(o.value) FROM UNNEST(t.outputs) o\n)) AS total_output\n'+transactionDay+';',
  unnestedSum: 'SELECT SUM(o.value) AS total_output\nFROM '+transactions+" t\nCROSS JOIN UNNEST(t.outputs) o\nWHERE t.block_timestamp_month = DATE('2024-01-01')\n  AND t.block_timestamp >= TIMESTAMP('2024-01-01')\n  AND t.block_timestamp < TIMESTAMP('2024-01-02');",
  crossJoin: dayBlocks+'SELECT COUNT(*) AS pairs\nFROM day_blocks a\nCROSS JOIN day_blocks b;',
  keyedJoin: dayBlocks+'SELECT COUNT(*) AS pairs\nFROM day_blocks a\nJOIN day_blocks b USING (block_number);',
  cteRepeated: dayBlocks+'SELECT\n  (SELECT SUM(transaction_count) FROM day_blocks) AS transactions,\n  (SELECT AVG(size) FROM day_blocks) AS mean_size;',
  cteOnePass: dayBlocks+'SELECT SUM(transaction_count) AS transactions, AVG(size) AS mean_size\nFROM day_blocks;',
};
