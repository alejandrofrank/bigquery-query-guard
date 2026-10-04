// Recorded public-data dry runs. No credentials, job IDs or billing-project identifiers.
export const measurements = {
  "capturedAt": "2026-10-04T03:14:12.729Z",
  "kind": "recorded-bigquery-dry-run",
  "location": "US",
  "useQueryCache": false,
  "queries": {
    "taxiAll": {
      "sql": "SELECT *\nFROM `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022`\nLIMIT 100;",
      "bytes": "7487651196",
      "schema": [
        {
          "name": "vendor_id",
          "type": "STRING"
        },
        {
          "name": "pickup_datetime",
          "type": "TIMESTAMP"
        },
        {
          "name": "dropoff_datetime",
          "type": "TIMESTAMP"
        },
        {
          "name": "passenger_count",
          "type": "INTEGER"
        },
        {
          "name": "trip_distance",
          "type": "NUMERIC"
        },
        {
          "name": "rate_code",
          "type": "STRING"
        },
        {
          "name": "store_and_fwd_flag",
          "type": "STRING"
        },
        {
          "name": "payment_type",
          "type": "STRING"
        },
        {
          "name": "fare_amount",
          "type": "NUMERIC"
        },
        {
          "name": "extra",
          "type": "NUMERIC"
        },
        {
          "name": "mta_tax",
          "type": "NUMERIC"
        },
        {
          "name": "tip_amount",
          "type": "NUMERIC"
        },
        {
          "name": "tolls_amount",
          "type": "NUMERIC"
        },
        {
          "name": "imp_surcharge",
          "type": "NUMERIC"
        },
        {
          "name": "airport_fee",
          "type": "NUMERIC"
        },
        {
          "name": "total_amount",
          "type": "NUMERIC"
        },
        {
          "name": "pickup_location_id",
          "type": "STRING"
        },
        {
          "name": "dropoff_location_id",
          "type": "STRING"
        },
        {
          "name": "data_file_year",
          "type": "INTEGER"
        },
        {
          "name": "data_file_month",
          "type": "INTEGER"
        }
      ]
    },
    "taxiTen": {
      "sql": "SELECT *\nFROM `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022`\nLIMIT 10;",
      "bytes": "7487651196",
      "schema": [
        {
          "name": "vendor_id",
          "type": "STRING"
        },
        {
          "name": "pickup_datetime",
          "type": "TIMESTAMP"
        },
        {
          "name": "dropoff_datetime",
          "type": "TIMESTAMP"
        },
        {
          "name": "passenger_count",
          "type": "INTEGER"
        },
        {
          "name": "trip_distance",
          "type": "NUMERIC"
        },
        {
          "name": "rate_code",
          "type": "STRING"
        },
        {
          "name": "store_and_fwd_flag",
          "type": "STRING"
        },
        {
          "name": "payment_type",
          "type": "STRING"
        },
        {
          "name": "fare_amount",
          "type": "NUMERIC"
        },
        {
          "name": "extra",
          "type": "NUMERIC"
        },
        {
          "name": "mta_tax",
          "type": "NUMERIC"
        },
        {
          "name": "tip_amount",
          "type": "NUMERIC"
        },
        {
          "name": "tolls_amount",
          "type": "NUMERIC"
        },
        {
          "name": "imp_surcharge",
          "type": "NUMERIC"
        },
        {
          "name": "airport_fee",
          "type": "NUMERIC"
        },
        {
          "name": "total_amount",
          "type": "NUMERIC"
        },
        {
          "name": "pickup_location_id",
          "type": "STRING"
        },
        {
          "name": "dropoff_location_id",
          "type": "STRING"
        },
        {
          "name": "data_file_year",
          "type": "INTEGER"
        },
        {
          "name": "data_file_month",
          "type": "INTEGER"
        }
      ]
    },
    "taxiFocused": {
      "sql": "SELECT vendor_id, pickup_datetime, total_amount\nFROM `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022`\nLIMIT 100;",
      "bytes": "978926553",
      "schema": [
        {
          "name": "vendor_id",
          "type": "STRING"
        },
        {
          "name": "pickup_datetime",
          "type": "TIMESTAMP"
        },
        {
          "name": "total_amount",
          "type": "NUMERIC"
        }
      ]
    },
    "taxiDay": {
      "sql": "SELECT vendor_id, pickup_datetime, total_amount\nFROM `bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022`\nWHERE pickup_datetime >= TIMESTAMP('2022-01-01')\n  AND pickup_datetime < TIMESTAMP('2022-01-02')\nLIMIT 100;",
      "bytes": "978926553",
      "schema": [
        {
          "name": "vendor_id",
          "type": "STRING"
        },
        {
          "name": "pickup_datetime",
          "type": "TIMESTAMP"
        },
        {
          "name": "total_amount",
          "type": "NUMERIC"
        }
      ]
    },
    "bitcoinAll": {
      "sql": "SELECT `hash`, block_timestamp, output_value\nFROM `bigquery-public-data.crypto_bitcoin.transactions`\nLIMIT 100;",
      "bytes": "130686374250",
      "schema": [
        {
          "name": "hash",
          "type": "STRING"
        },
        {
          "name": "block_timestamp",
          "type": "TIMESTAMP"
        },
        {
          "name": "output_value",
          "type": "NUMERIC"
        }
      ]
    },
    "bitcoinDay": {
      "sql": "SELECT `hash`, block_timestamp, output_value\nFROM `bigquery-public-data.crypto_bitcoin.transactions`\nWHERE block_timestamp_month = DATE('2024-01-01')\n  AND block_timestamp >= TIMESTAMP('2024-01-01')\n  AND block_timestamp < TIMESTAMP('2024-01-02')\nLIMIT 100;",
      "bytes": "169415050",
      "schema": [
        {
          "name": "hash",
          "type": "STRING"
        },
        {
          "name": "block_timestamp",
          "type": "TIMESTAMP"
        },
        {
          "name": "output_value",
          "type": "NUMERIC"
        }
      ]
    },
    "transactionCount": {
      "sql": "SELECT COUNT(*) AS transactions\nFROM `bigquery-public-data.crypto_bitcoin.transactions`\nWHERE block_timestamp_month = DATE('2024-01-01')\n  AND block_timestamp >= TIMESTAMP('2024-01-01')\n  AND block_timestamp < TIMESTAMP('2024-01-02');",
      "bytes": "27659600",
      "schema": [
        {
          "name": "transactions",
          "type": "INTEGER"
        }
      ]
    },
    "blockCount": {
      "sql": "SELECT SUM(transaction_count) AS transactions\nFROM `bigquery-public-data.crypto_bitcoin.blocks`\nWHERE timestamp_month = DATE('2024-01-01')\n  AND timestamp >= TIMESTAMP('2024-01-01')\n  AND timestamp < TIMESTAMP('2024-01-02');",
      "bytes": "23274984",
      "schema": [
        {
          "name": "transactions",
          "type": "INTEGER"
        }
      ]
    }
  },
  "summaryVerification": {
    "verifiedAt": "2026-10-04T03:15:06.111Z",
    "maximumBytesBilled": "50000000",
    "results": {
      "transactionCount": {
        "transactions": "657752",
        "billedBytes": "14680064"
      },
      "blockCount": {
        "transactions": "657752",
        "billedBytes": "10485760"
      }
    },
    "equal": true
  }
};
