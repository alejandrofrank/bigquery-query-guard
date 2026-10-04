import {storageQueries} from './storage-specs.js';
import {compositionQueries} from './composition-specs.js';
const taxi = '`bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022`';
const transactions = '`bigquery-public-data.crypto_bitcoin.transactions`';
const blocks = '`bigquery-public-data.crypto_bitcoin.blocks`';
export const queries = {
  taxiAll: 'SELECT *\nFROM '+taxi+'\nLIMIT 100;',
  taxiTen: 'SELECT *\nFROM '+taxi+'\nLIMIT 10;',
  taxiFocused: 'SELECT vendor_id, pickup_datetime, total_amount\nFROM '+taxi+'\nLIMIT 100;',
  taxiDay: "SELECT vendor_id, pickup_datetime, total_amount\nFROM "+taxi+"\nWHERE pickup_datetime >= TIMESTAMP('2022-01-01')\n  AND pickup_datetime < TIMESTAMP('2022-01-02')\nLIMIT 100;",
  bitcoinAll: 'SELECT `hash`, block_timestamp, output_value\nFROM '+transactions+'\nLIMIT 100;',
  bitcoinDay: "SELECT `hash`, block_timestamp, output_value\nFROM "+transactions+"\nWHERE block_timestamp_month = DATE('2024-01-01')\n  AND block_timestamp >= TIMESTAMP('2024-01-01')\n  AND block_timestamp < TIMESTAMP('2024-01-02')\nLIMIT 100;",
  transactionCount: "SELECT COUNT(*) AS transactions\nFROM "+transactions+"\nWHERE block_timestamp_month = DATE('2024-01-01')\n  AND block_timestamp >= TIMESTAMP('2024-01-01')\n  AND block_timestamp < TIMESTAMP('2024-01-02');",
  blockCount: "SELECT SUM(transaction_count) AS transactions\nFROM "+blocks+"\nWHERE timestamp_month = DATE('2024-01-01')\n  AND timestamp >= TIMESTAMP('2024-01-01')\n  AND timestamp < TIMESTAMP('2024-01-02');",
  ...storageQueries,
  ...compositionQueries,
};
