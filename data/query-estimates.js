// Recorded public-data dry runs. No credentials, job IDs or billing-project identifiers.
export const measurements = {
  "capturedAt": "2026-10-04T03:52:34.209Z",
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
    },
    "partitionWeek": {
      "sql": "SELECT COUNT(*) AS `rows`, SUM(score) AS score_total\nFROM `bigquery-public-data.google_trends.top_terms`\nWHERE refresh_date BETWEEN DATE('2026-09-25') AND DATE('2026-10-01');",
      "bytes": "84718248",
      "schema": [
        {
          "name": "rows",
          "type": "INTEGER"
        },
        {
          "name": "score_total",
          "type": "INTEGER"
        }
      ]
    },
    "partitionDay": {
      "sql": "SELECT COUNT(*) AS `rows`, SUM(score) AS score_total\nFROM `bigquery-public-data.google_trends.top_terms`\nWHERE refresh_date = DATE('2026-10-01');",
      "bytes": "11719744",
      "schema": [
        {
          "name": "rows",
          "type": "INTEGER"
        },
        {
          "name": "score_total",
          "type": "INTEGER"
        }
      ]
    },
    "partitionFunction": {
      "sql": "SELECT COUNT(*) AS `rows`, SUM(score) AS score_total\nFROM `bigquery-public-data.google_trends.top_terms`\nWHERE FORMAT_DATE('%Y-%m-%d', refresh_date) = '2026-10-01';",
      "bytes": "377552864",
      "schema": [
        {
          "name": "rows",
          "type": "INTEGER"
        },
        {
          "name": "score_total",
          "type": "INTEGER"
        }
      ]
    },
    "unionAll": {
      "sql": "WITH day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number, size, transaction_count\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\nSELECT COUNT(*) AS `rows`, SUM(transaction_count) AS transactions\nFROM (\n  SELECT block_hash, transaction_count FROM day_blocks\n  UNION ALL\n  SELECT block_hash, transaction_count FROM day_blocks\n);",
      "bytes": "23274984",
      "schema": [
        {
          "name": "rows",
          "type": "INTEGER"
        },
        {
          "name": "transactions",
          "type": "INTEGER"
        }
      ]
    },
    "unionDistinct": {
      "sql": "WITH day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number, size, transaction_count\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\nSELECT COUNT(*) AS `rows`, SUM(transaction_count) AS transactions\nFROM (\n  SELECT block_hash, transaction_count FROM day_blocks\n  UNION DISTINCT\n  SELECT block_hash, transaction_count FROM day_blocks\n);",
      "bytes": "87281190",
      "schema": [
        {
          "name": "rows",
          "type": "INTEGER"
        },
        {
          "name": "transactions",
          "type": "INTEGER"
        }
      ]
    },
    "joinRaw": {
      "sql": "WITH day_transactions AS (\n  SELECT block_hash, output_value\n  FROM `bigquery-public-data.crypto_bitcoin.transactions` t\n  WHERE t.block_timestamp_month = DATE('2024-01-01')\n    AND t.block_timestamp >= TIMESTAMP('2024-01-01')\n    AND t.block_timestamp < TIMESTAMP('2024-01-02')\n), day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\nSELECT b.block_number, COUNT(*) AS transactions,\n  SUM(t.output_value) AS total_output\nFROM day_transactions t\nJOIN day_blocks b USING (block_hash)\nGROUP BY b.block_number\nORDER BY b.block_number\nLIMIT 100;",
      "bytes": "256696240",
      "schema": [
        {
          "name": "block_number",
          "type": "INTEGER"
        },
        {
          "name": "transactions",
          "type": "INTEGER"
        },
        {
          "name": "total_output",
          "type": "NUMERIC"
        }
      ]
    },
    "joinAggregated": {
      "sql": "WITH day_transactions AS (\n  SELECT block_hash, output_value\n  FROM `bigquery-public-data.crypto_bitcoin.transactions` t\n  WHERE t.block_timestamp_month = DATE('2024-01-01')\n    AND t.block_timestamp >= TIMESTAMP('2024-01-01')\n    AND t.block_timestamp < TIMESTAMP('2024-01-02')\n), day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\n, grouped_transactions AS (\n  SELECT block_hash, COUNT(*) AS transactions, SUM(output_value) AS total_output\n  FROM day_transactions\n  GROUP BY block_hash\n)\nSELECT b.block_number, t.transactions, t.total_output\nFROM grouped_transactions t\nJOIN day_blocks b USING (block_hash)\nORDER BY b.block_number\nLIMIT 100;",
      "bytes": "256696240",
      "schema": [
        {
          "name": "block_number",
          "type": "INTEGER"
        },
        {
          "name": "transactions",
          "type": "INTEGER"
        },
        {
          "name": "total_output",
          "type": "NUMERIC"
        }
      ]
    },
    "correlatedSum": {
      "sql": "SELECT SUM((\n  SELECT SUM(o.value) FROM UNNEST(t.outputs) o\n)) AS total_output\nFROM `bigquery-public-data.crypto_bitcoin.transactions` t\nWHERE t.block_timestamp_month = DATE('2024-01-01')\n  AND t.block_timestamp >= TIMESTAMP('2024-01-01')\n  AND t.block_timestamp < TIMESTAMP('2024-01-02');",
      "bytes": "92065952",
      "schema": [
        {
          "name": "total_output",
          "type": "NUMERIC"
        }
      ]
    },
    "unnestedSum": {
      "sql": "SELECT SUM(o.value) AS total_output\nFROM `bigquery-public-data.crypto_bitcoin.transactions` t\nCROSS JOIN UNNEST(t.outputs) o\nWHERE t.block_timestamp_month = DATE('2024-01-01')\n  AND t.block_timestamp >= TIMESTAMP('2024-01-01')\n  AND t.block_timestamp < TIMESTAMP('2024-01-02');",
      "bytes": "92065952",
      "schema": [
        {
          "name": "total_output",
          "type": "NUMERIC"
        }
      ]
    },
    "crossJoin": {
      "sql": "WITH day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number, size, transaction_count\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\nSELECT COUNT(*) AS pairs\nFROM day_blocks a\nCROSS JOIN day_blocks b;",
      "bytes": "15516656",
      "schema": [
        {
          "name": "pairs",
          "type": "INTEGER"
        }
      ]
    },
    "keyedJoin": {
      "sql": "WITH day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number, size, transaction_count\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\nSELECT COUNT(*) AS pairs\nFROM day_blocks a\nJOIN day_blocks b USING (block_number);",
      "bytes": "23274984",
      "schema": [
        {
          "name": "pairs",
          "type": "INTEGER"
        }
      ]
    },
    "cteRepeated": {
      "sql": "WITH day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number, size, transaction_count\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\nSELECT\n  (SELECT SUM(transaction_count) FROM day_blocks) AS transactions,\n  (SELECT AVG(size) FROM day_blocks) AS mean_size;",
      "bytes": "31033312",
      "schema": [
        {
          "name": "transactions",
          "type": "INTEGER"
        },
        {
          "name": "mean_size",
          "type": "FLOAT"
        }
      ]
    },
    "cteOnePass": {
      "sql": "WITH day_blocks AS (\n  SELECT `hash` AS block_hash, number AS block_number, size, transaction_count\n  FROM `bigquery-public-data.crypto_bitcoin.blocks`\n  WHERE timestamp_month = DATE('2024-01-01')\n    AND timestamp >= TIMESTAMP('2024-01-01')\n    AND timestamp < TIMESTAMP('2024-01-02')\n)\nSELECT SUM(transaction_count) AS transactions, AVG(size) AS mean_size\nFROM day_blocks;",
      "bytes": "31033312",
      "schema": [
        {
          "name": "transactions",
          "type": "INTEGER"
        },
        {
          "name": "mean_size",
          "type": "FLOAT"
        }
      ]
    }
  },
  "sources": {
    "bigquery-public-data.new_york_taxi_trips.tlc_yellow_trips_2022": {
      "type": "TABLE",
      "partitioning": null
    },
    "bigquery-public-data.crypto_bitcoin.transactions": {
      "type": "VIEW",
      "partitioning": null
    },
    "bigquery-public-data.crypto_bitcoin.blocks": {
      "type": "VIEW",
      "partitioning": null
    },
    "bigquery-public-data.google_trends.top_terms": {
      "type": "TABLE",
      "partitioning": {
        "type": "DAY",
        "field": "refresh_date"
      }
    }
  },
  "benchmarks": {
    "capturedAt": "2026-10-04T03:56:36.699Z",
    "samples": 3,
    "maximumBytesBilled": "300000000",
    "totalReservationLimit": "15000000000",
    "reservedBytes": "13500000000",
    "useQueryCache": false,
    "jobTimeoutMs": 30000,
    "order": "sequential, query then repetition",
    "results": {
      "taxiAll": {
        "status": "skipped",
        "reason": "Dry-run estimate exceeds the per-run cap."
      },
      "taxiTen": {
        "status": "skipped",
        "reason": "Dry-run estimate exceeds the per-run cap."
      },
      "taxiFocused": {
        "status": "skipped",
        "reason": "Dry-run estimate exceeds the per-run cap."
      },
      "taxiDay": {
        "status": "skipped",
        "reason": "Dry-run estimate exceeds the per-run cap."
      },
      "bitcoinAll": {
        "status": "skipped",
        "reason": "Dry-run estimate exceeds the per-run cap."
      },
      "bitcoinDay": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 355,
            "queueMs": 161,
            "clientMs": 1240,
            "processedBytes": "87897572",
            "billedBytes": "88080384",
            "slotMs": "309",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "039702936342a8bd5bd37f82d126e337ec4d926af6beca3d3f5d5237c923ad82",
            "output": [],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "LIMIT",
                  "WRITE"
                ],
                "recordsRead": "244695",
                "recordsWritten": "100",
                "shuffleBytes": "9300",
                "spilledBytes": "0",
                "slotMs": "309"
              }
            ]
          },
          {
            "jobMs": 354,
            "queueMs": 183,
            "clientMs": 966,
            "processedBytes": "87897572",
            "billedBytes": "88080384",
            "slotMs": "253",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "039702936342a8bd5bd37f82d126e337ec4d926af6beca3d3f5d5237c923ad82",
            "output": [],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "LIMIT",
                  "WRITE"
                ],
                "recordsRead": "264842",
                "recordsWritten": "100",
                "shuffleBytes": "9300",
                "spilledBytes": "0",
                "slotMs": "253"
              }
            ]
          },
          {
            "jobMs": 474,
            "queueMs": 190,
            "clientMs": 1110,
            "processedBytes": "87897572",
            "billedBytes": "88080384",
            "slotMs": "157",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "039702936342a8bd5bd37f82d126e337ec4d926af6beca3d3f5d5237c923ad82",
            "output": [],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "LIMIT",
                  "WRITE"
                ],
                "recordsRead": "236170",
                "recordsWritten": "100",
                "shuffleBytes": "9300",
                "spilledBytes": "0",
                "slotMs": "157"
              }
            ]
          }
        ]
      },
      "transactionCount": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 613,
            "queueMs": 853,
            "clientMs": 1914,
            "processedBytes": "14350624",
            "billedBytes": "14680064",
            "slotMs": "275",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "9347c68393f072dea3b1da0ab5b042973196c131e68a30326923955ca4cfee5a",
            "output": [
              {
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "275"
              }
            ]
          },
          {
            "jobMs": 493,
            "queueMs": 1064,
            "clientMs": 2008,
            "processedBytes": "14350624",
            "billedBytes": "14680064",
            "slotMs": "213",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "9347c68393f072dea3b1da0ab5b042973196c131e68a30326923955ca4cfee5a",
            "output": [
              {
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "213"
              }
            ]
          },
          {
            "jobMs": 758,
            "queueMs": 143,
            "clientMs": 1349,
            "processedBytes": "14350624",
            "billedBytes": "14680064",
            "slotMs": "228",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "9347c68393f072dea3b1da0ab5b042973196c131e68a30326923955ca4cfee5a",
            "output": [
              {
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "228"
              }
            ]
          }
        ]
      },
      "blockCount": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 3479,
            "queueMs": 177,
            "clientMs": 4113,
            "processedBytes": "9600",
            "billedBytes": "10485760",
            "slotMs": "1010",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "9347c68393f072dea3b1da0ab5b042973196c131e68a30326923955ca4cfee5a",
            "output": [
              {
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "25",
                "shuffleBytes": "41",
                "spilledBytes": "0",
                "slotMs": "968"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "25",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "41"
              }
            ]
          },
          {
            "jobMs": 4498,
            "queueMs": 203,
            "clientMs": 4965,
            "processedBytes": "9600",
            "billedBytes": "10485760",
            "slotMs": "214",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "9347c68393f072dea3b1da0ab5b042973196c131e68a30326923955ca4cfee5a",
            "output": [
              {
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "19",
                "spilledBytes": "0",
                "slotMs": "193"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "21"
              }
            ]
          },
          {
            "jobMs": 3613,
            "queueMs": 247,
            "clientMs": 4173,
            "processedBytes": "9600",
            "billedBytes": "10485760",
            "slotMs": "384",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "9347c68393f072dea3b1da0ab5b042973196c131e68a30326923955ca4cfee5a",
            "output": [
              {
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "19",
                "spilledBytes": "0",
                "slotMs": "335"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "48"
              }
            ]
          }
        ]
      },
      "partitionWeek": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 230,
            "queueMs": 165,
            "clientMs": 855,
            "processedBytes": "84718248",
            "billedBytes": "84934656",
            "slotMs": "137",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "579f4f355d48fc7590d6ba07ec72fd0c0022107e93be215fbb499d4188bbf631",
            "output": [
              {
                "rows": "9618000",
                "score_total": "33427894"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "9618000",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "137"
              }
            ]
          },
          {
            "jobMs": 262,
            "queueMs": 75,
            "clientMs": 770,
            "processedBytes": "84718248",
            "billedBytes": "84934656",
            "slotMs": "118",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "579f4f355d48fc7590d6ba07ec72fd0c0022107e93be215fbb499d4188bbf631",
            "output": [
              {
                "rows": "9618000",
                "score_total": "33427894"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "9618000",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "118"
              }
            ]
          },
          {
            "jobMs": 184,
            "queueMs": 183,
            "clientMs": 796,
            "processedBytes": "84718248",
            "billedBytes": "84934656",
            "slotMs": "190",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "579f4f355d48fc7590d6ba07ec72fd0c0022107e93be215fbb499d4188bbf631",
            "output": [
              {
                "rows": "9618000",
                "score_total": "33427894"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "9618000",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "190"
              }
            ]
          }
        ]
      },
      "partitionDay": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 211,
            "queueMs": 58,
            "clientMs": 701,
            "processedBytes": "11719744",
            "billedBytes": "12582912",
            "slotMs": "51",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "8b71bd693e8ddc5533ada229bd591eb57ffa767a23406a5ee1070a56329713ac",
            "output": [
              {
                "rows": "1375500",
                "score_total": "3707335"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "1375500",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "51"
              }
            ]
          },
          {
            "jobMs": 166,
            "queueMs": 109,
            "clientMs": 696,
            "processedBytes": "11719744",
            "billedBytes": "12582912",
            "slotMs": "34",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "8b71bd693e8ddc5533ada229bd591eb57ffa767a23406a5ee1070a56329713ac",
            "output": [
              {
                "rows": "1375500",
                "score_total": "3707335"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "1375500",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "34"
              }
            ]
          },
          {
            "jobMs": 180,
            "queueMs": 189,
            "clientMs": 804,
            "processedBytes": "11719744",
            "billedBytes": "12582912",
            "slotMs": "34",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "8b71bd693e8ddc5533ada229bd591eb57ffa767a23406a5ee1070a56329713ac",
            "output": [
              {
                "rows": "1375500",
                "score_total": "3707335"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "1375500",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "34"
              }
            ]
          }
        ]
      },
      "partitionFunction": {
        "status": "skipped",
        "reason": "Dry-run estimate exceeds the per-run cap."
      },
      "unionAll": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 3872,
            "queueMs": 138,
            "clientMs": 4300,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "620",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7a67c9b0526a2d7ce0b70d9485c705b5d0bd7b50fbc2a19115c8cad988f8a221",
            "output": [
              {
                "rows": "310",
                "transactions": "1315504"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "806",
                "recordsWritten": "6",
                "shuffleBytes": "92",
                "spilledBytes": "0",
                "slotMs": "582"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "6",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "37"
              }
            ]
          },
          {
            "jobMs": 3843,
            "queueMs": 178,
            "clientMs": 4393,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "365",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7a67c9b0526a2d7ce0b70d9485c705b5d0bd7b50fbc2a19115c8cad988f8a221",
            "output": [
              {
                "rows": "310",
                "transactions": "1315504"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "806",
                "recordsWritten": "6",
                "shuffleBytes": "92",
                "spilledBytes": "0",
                "slotMs": "338"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "6",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "26"
              }
            ]
          },
          {
            "jobMs": 3044,
            "queueMs": 197,
            "clientMs": 3586,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "424",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7a67c9b0526a2d7ce0b70d9485c705b5d0bd7b50fbc2a19115c8cad988f8a221",
            "output": [
              {
                "rows": "310",
                "transactions": "1315504"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "806",
                "recordsWritten": "6",
                "shuffleBytes": "92",
                "spilledBytes": "0",
                "slotMs": "415"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "6",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "9"
              }
            ]
          }
        ]
      },
      "unionDistinct": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 3601,
            "queueMs": 143,
            "clientMs": 4057,
            "processedBytes": "72000",
            "billedBytes": "10485760",
            "slotMs": "11890",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1b7e4260fe84d07354a03ad273b02d5ab3e967f2880057f9bca99f19f863b04d",
            "output": [
              {
                "rows": "155",
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "806",
                "recordsWritten": "310",
                "shuffleBytes": "24180",
                "spilledBytes": "0",
                "slotMs": "303"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "310",
                "recordsWritten": "970",
                "shuffleBytes": "10836",
                "spilledBytes": "0",
                "slotMs": "11409"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "970",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "26"
              }
            ]
          },
          {
            "jobMs": 4399,
            "queueMs": 210,
            "clientMs": 5001,
            "processedBytes": "72000",
            "billedBytes": "10485760",
            "slotMs": "15370",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1b7e4260fe84d07354a03ad273b02d5ab3e967f2880057f9bca99f19f863b04d",
            "output": [
              {
                "rows": "155",
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "806",
                "recordsWritten": "310",
                "shuffleBytes": "24180",
                "spilledBytes": "0",
                "slotMs": "235"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "310",
                "recordsWritten": "970",
                "shuffleBytes": "10836",
                "spilledBytes": "0",
                "slotMs": "14819"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "970",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "42"
              }
            ]
          },
          {
            "jobMs": 4134,
            "queueMs": 146,
            "clientMs": 4610,
            "processedBytes": "72000",
            "billedBytes": "10485760",
            "slotMs": "21825",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1b7e4260fe84d07354a03ad273b02d5ab3e967f2880057f9bca99f19f863b04d",
            "output": [
              {
                "rows": "155",
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "806",
                "recordsWritten": "310",
                "shuffleBytes": "24180",
                "spilledBytes": "0",
                "slotMs": "923"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "310",
                "recordsWritten": "970",
                "shuffleBytes": "10836",
                "spilledBytes": "0",
                "slotMs": "20871"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "970",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "30"
              }
            ]
          }
        ]
      },
      "joinRaw": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 3761,
            "queueMs": 149,
            "clientMs": 4337,
            "processedBytes": "87933572",
            "billedBytes": "88080384",
            "slotMs": "8209",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "58f0fa752cb022c541b2f8363cdae439027105fbde3e3761c9093904f11dc3b9",
            "output": [
              {
                "block_number": "823786",
                "total_output": "2596810622791",
                "transactions": "985"
              },
              {
                "block_number": "823787",
                "total_output": "664816855499",
                "transactions": "3580"
              },
              {
                "block_number": "823788",
                "total_output": "507365395022",
                "transactions": "3636"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "12090",
                "spilledBytes": "0",
                "slotMs": "107"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "1",
                "shuffleBytes": "11149",
                "spilledBytes": "0",
                "slotMs": "66"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "909471",
                "recordsWritten": "155",
                "shuffleBytes": "5425",
                "spilledBytes": "0",
                "slotMs": "677"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "SORT",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "155",
                "shuffleBytes": "5425",
                "spilledBytes": "0",
                "slotMs": "7312"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "22"
              }
            ]
          },
          {
            "jobMs": 4414,
            "queueMs": 235,
            "clientMs": 4976,
            "processedBytes": "87933572",
            "billedBytes": "88080384",
            "slotMs": "6934",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "58f0fa752cb022c541b2f8363cdae439027105fbde3e3761c9093904f11dc3b9",
            "output": [
              {
                "block_number": "823786",
                "total_output": "2596810622791",
                "transactions": "985"
              },
              {
                "block_number": "823787",
                "total_output": "664816855499",
                "transactions": "3580"
              },
              {
                "block_number": "823788",
                "total_output": "507365395022",
                "transactions": "3636"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "12090",
                "spilledBytes": "0",
                "slotMs": "144"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "1",
                "shuffleBytes": "11149",
                "spilledBytes": "0",
                "slotMs": "43"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "910091",
                "recordsWritten": "155",
                "shuffleBytes": "5425",
                "spilledBytes": "0",
                "slotMs": "780"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "SORT",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "155",
                "shuffleBytes": "5425",
                "spilledBytes": "0",
                "slotMs": "5928"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "24"
              }
            ]
          },
          {
            "jobMs": 4178,
            "queueMs": 207,
            "clientMs": 4669,
            "processedBytes": "87933572",
            "billedBytes": "88080384",
            "slotMs": "8220",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "58f0fa752cb022c541b2f8363cdae439027105fbde3e3761c9093904f11dc3b9",
            "output": [
              {
                "block_number": "823786",
                "total_output": "2596810622791",
                "transactions": "985"
              },
              {
                "block_number": "823787",
                "total_output": "664816855499",
                "transactions": "3580"
              },
              {
                "block_number": "823788",
                "total_output": "507365395022",
                "transactions": "3636"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "12090",
                "spilledBytes": "0",
                "slotMs": "106"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "1",
                "shuffleBytes": "11149",
                "spilledBytes": "0",
                "slotMs": "8"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "910091",
                "recordsWritten": "155",
                "shuffleBytes": "5425",
                "spilledBytes": "0",
                "slotMs": "458"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "SORT",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "155",
                "shuffleBytes": "5425",
                "spilledBytes": "0",
                "slotMs": "7563"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "155",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "22"
              }
            ]
          }
        ]
      },
      "joinAggregated": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 4168,
            "queueMs": 154,
            "clientMs": 4642,
            "processedBytes": "87933572",
            "billedBytes": "88080384",
            "slotMs": "584",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "58f0fa752cb022c541b2f8363cdae439027105fbde3e3761c9093904f11dc3b9",
            "output": [
              {
                "block_number": "823786",
                "total_output": "2596810622791",
                "transactions": "985"
              },
              {
                "block_number": "823787",
                "total_output": "664816855499",
                "transactions": "3580"
              },
              {
                "block_number": "823788",
                "total_output": "507365395022",
                "transactions": "3636"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "155",
                "shuffleBytes": "14725",
                "spilledBytes": "0",
                "slotMs": "397"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "12090",
                "spilledBytes": "0",
                "slotMs": "98"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "SORT",
                  "JOIN",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "310",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "14"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "100",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "50"
              }
            ]
          },
          {
            "jobMs": 3268,
            "queueMs": 239,
            "clientMs": 3857,
            "processedBytes": "87933572",
            "billedBytes": "88080384",
            "slotMs": "655",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "58f0fa752cb022c541b2f8363cdae439027105fbde3e3761c9093904f11dc3b9",
            "output": [
              {
                "block_number": "823786",
                "total_output": "2596810622791",
                "transactions": "985"
              },
              {
                "block_number": "823787",
                "total_output": "664816855499",
                "transactions": "3580"
              },
              {
                "block_number": "823788",
                "total_output": "507365395022",
                "transactions": "3636"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "155",
                "shuffleBytes": "14725",
                "spilledBytes": "0",
                "slotMs": "505"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "12090",
                "spilledBytes": "0",
                "slotMs": "79"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "SORT",
                  "JOIN",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "310",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "22"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "100",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "30"
              }
            ]
          },
          {
            "jobMs": 2909,
            "queueMs": 186,
            "clientMs": 3514,
            "processedBytes": "87933572",
            "billedBytes": "88080384",
            "slotMs": "655",
            "cacheHit": false,
            "rowCount": 100,
            "resultDigest": "58f0fa752cb022c541b2f8363cdae439027105fbde3e3761c9093904f11dc3b9",
            "output": [
              {
                "block_number": "823786",
                "total_output": "2596810622791",
                "transactions": "985"
              },
              {
                "block_number": "823787",
                "total_output": "664816855499",
                "transactions": "3580"
              },
              {
                "block_number": "823788",
                "total_output": "507365395022",
                "transactions": "3636"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "155",
                "shuffleBytes": "14725",
                "spilledBytes": "0",
                "slotMs": "478"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "12090",
                "spilledBytes": "0",
                "slotMs": "140"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "SORT",
                  "JOIN",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "310",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "10"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "100",
                "recordsWritten": "100",
                "shuffleBytes": "3500",
                "spilledBytes": "0",
                "slotMs": "26"
              }
            ]
          }
        ]
      },
      "correlatedSum": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 438,
            "queueMs": 223,
            "clientMs": 1104,
            "processedBytes": "46717328",
            "billedBytes": "47185920",
            "slotMs": "929",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1fc142e62710e5553efa0ba7bc130653d75e77c681f6efdeb996dcd2261bd875",
            "output": [
              {
                "total_output": "53108415000158"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "7",
                "shuffleBytes": "103",
                "spilledBytes": "0",
                "slotMs": "887"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "7",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "42"
              }
            ]
          },
          {
            "jobMs": 451,
            "queueMs": 189,
            "clientMs": 1074,
            "processedBytes": "46717328",
            "billedBytes": "47185920",
            "slotMs": "692",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1fc142e62710e5553efa0ba7bc130653d75e77c681f6efdeb996dcd2261bd875",
            "output": [
              {
                "total_output": "53108415000158"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "7",
                "shuffleBytes": "103",
                "spilledBytes": "0",
                "slotMs": "674"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "7",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "18"
              }
            ]
          },
          {
            "jobMs": 411,
            "queueMs": 134,
            "clientMs": 987,
            "processedBytes": "46717328",
            "billedBytes": "47185920",
            "slotMs": "782",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1fc142e62710e5553efa0ba7bc130653d75e77c681f6efdeb996dcd2261bd875",
            "output": [
              {
                "total_output": "53108415000158"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "7",
                "shuffleBytes": "103",
                "spilledBytes": "0",
                "slotMs": "659"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "7",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "123"
              }
            ]
          }
        ]
      },
      "unnestedSum": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 384,
            "queueMs": 141,
            "clientMs": 955,
            "processedBytes": "46717328",
            "billedBytes": "47185920",
            "slotMs": "581",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1fc142e62710e5553efa0ba7bc130653d75e77c681f6efdeb996dcd2261bd875",
            "output": [
              {
                "total_output": "53108415000158"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "7",
                "shuffleBytes": "103",
                "spilledBytes": "0",
                "slotMs": "544"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "7",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "37"
              }
            ]
          },
          {
            "jobMs": 404,
            "queueMs": 96,
            "clientMs": 907,
            "processedBytes": "46717328",
            "billedBytes": "47185920",
            "slotMs": "518",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1fc142e62710e5553efa0ba7bc130653d75e77c681f6efdeb996dcd2261bd875",
            "output": [
              {
                "total_output": "53108415000158"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "7",
                "shuffleBytes": "103",
                "spilledBytes": "0",
                "slotMs": "503"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "7",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "14"
              }
            ]
          },
          {
            "jobMs": 1654,
            "queueMs": 258,
            "clientMs": 2373,
            "processedBytes": "46717328",
            "billedBytes": "47185920",
            "slotMs": "702",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "1fc142e62710e5553efa0ba7bc130653d75e77c681f6efdeb996dcd2261bd875",
            "output": [
              {
                "total_output": "53108415000158"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "909161",
                "recordsWritten": "7",
                "shuffleBytes": "103",
                "spilledBytes": "0",
                "slotMs": "660"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "7",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "41"
              }
            ]
          }
        ]
      },
      "crossJoin": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 3966,
            "queueMs": 191,
            "clientMs": 4397,
            "processedBytes": "12800",
            "billedBytes": "10485760",
            "slotMs": "5610",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5c10850176cd3f84114f0011b4a213ec38c3e300ad802f71c24593f02440121b",
            "output": [
              {
                "pairs": "24025"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "113"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "265"
              },
              {
                "id": "2",
                "operations": [
                  "READ"
                ],
                "recordsRead": "0",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "2211"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "0",
                "recordsWritten": "40",
                "shuffleBytes": "360",
                "spilledBytes": "0",
                "slotMs": "3003"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "40",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "16"
              }
            ]
          },
          {
            "jobMs": 3607,
            "queueMs": 122,
            "clientMs": 4072,
            "processedBytes": "12800",
            "billedBytes": "10485760",
            "slotMs": "5826",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5c10850176cd3f84114f0011b4a213ec38c3e300ad802f71c24593f02440121b",
            "output": [
              {
                "pairs": "24025"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "251"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "201"
              },
              {
                "id": "2",
                "operations": [
                  "READ"
                ],
                "recordsRead": "0",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "1783"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "0",
                "recordsWritten": "40",
                "shuffleBytes": "360",
                "spilledBytes": "0",
                "slotMs": "3560"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "40",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "29"
              }
            ]
          },
          {
            "jobMs": 3193,
            "queueMs": 83,
            "clientMs": 3657,
            "processedBytes": "12800",
            "billedBytes": "10485760",
            "slotMs": "5545",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5c10850176cd3f84114f0011b4a213ec38c3e300ad802f71c24593f02440121b",
            "output": [
              {
                "pairs": "24025"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "67"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "80"
              },
              {
                "id": "2",
                "operations": [
                  "READ"
                ],
                "recordsRead": "0",
                "recordsWritten": "155",
                "shuffleBytes": "0",
                "spilledBytes": "0",
                "slotMs": "2134"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "0",
                "recordsWritten": "40",
                "shuffleBytes": "360",
                "spilledBytes": "0",
                "slotMs": "3228"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "40",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "34"
              }
            ]
          }
        ]
      },
      "keyedJoin": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 4232,
            "queueMs": 153,
            "clientMs": 4683,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "437",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "855712efbcbc533812232c500357edbf574548b0bce4d3216e27e6e9c5de7d91",
            "output": [
              {
                "pairs": "155"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "1395",
                "spilledBytes": "0",
                "slotMs": "132"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "713",
                "recordsWritten": "3",
                "shuffleBytes": "27",
                "spilledBytes": "0",
                "slotMs": "131"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "54"
              }
            ]
          },
          {
            "jobMs": 3568,
            "queueMs": 138,
            "clientMs": 4007,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "804",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "855712efbcbc533812232c500357edbf574548b0bce4d3216e27e6e9c5de7d91",
            "output": [
              {
                "pairs": "155"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "1395",
                "spilledBytes": "0",
                "slotMs": "120"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "713",
                "recordsWritten": "3",
                "shuffleBytes": "27",
                "spilledBytes": "0",
                "slotMs": "87"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "11"
              }
            ]
          },
          {
            "jobMs": 5091,
            "queueMs": 188,
            "clientMs": 5545,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "373",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "855712efbcbc533812232c500357edbf574548b0bce4d3216e27e6e9c5de7d91",
            "output": [
              {
                "pairs": "155"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "155",
                "shuffleBytes": "1395",
                "spilledBytes": "0",
                "slotMs": "93"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "713",
                "recordsWritten": "3",
                "shuffleBytes": "27",
                "spilledBytes": "0",
                "slotMs": "90"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "24"
              }
            ]
          }
        ]
      },
      "cteRepeated": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 3551,
            "queueMs": 274,
            "clientMs": 4317,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "582",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5bbdd2287edfffc07a8560dde29dc8234d924af8a5fc1f5f34d0881742f9efb4",
            "output": [
              {
                "mean_size": 1653640.2903225806,
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "34",
                "spilledBytes": "0",
                "slotMs": "273"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "19",
                "spilledBytes": "0",
                "slotMs": "238"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "19"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "22"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "2",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "27"
              }
            ]
          },
          {
            "jobMs": 3286,
            "queueMs": 152,
            "clientMs": 3797,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "191",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5bbdd2287edfffc07a8560dde29dc8234d924af8a5fc1f5f34d0881742f9efb4",
            "output": [
              {
                "mean_size": 1653640.2903225806,
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "34",
                "spilledBytes": "0",
                "slotMs": "82"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "19",
                "spilledBytes": "0",
                "slotMs": "52"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "14"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "19"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "2",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "22"
              }
            ]
          },
          {
            "jobMs": 3323,
            "queueMs": 206,
            "clientMs": 3838,
            "processedBytes": "19200",
            "billedBytes": "10485760",
            "slotMs": "211",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5bbdd2287edfffc07a8560dde29dc8234d924af8a5fc1f5f34d0881742f9efb4",
            "output": [
              {
                "mean_size": 1653640.2903225806,
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "34",
                "spilledBytes": "0",
                "slotMs": "90"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "19",
                "spilledBytes": "0",
                "slotMs": "77"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "13"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "13"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "2",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "16"
              }
            ]
          }
        ]
      },
      "cteOnePass": {
        "status": "complete",
        "runs": [
          {
            "jobMs": 3814,
            "queueMs": 122,
            "clientMs": 4319,
            "processedBytes": "12800",
            "billedBytes": "10485760",
            "slotMs": "357",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5bbdd2287edfffc07a8560dde29dc8234d924af8a5fc1f5f34d0881742f9efb4",
            "output": [
              {
                "mean_size": 1653640.2903225806,
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "53",
                "spilledBytes": "0",
                "slotMs": "342"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "14"
              }
            ]
          },
          {
            "jobMs": 2849,
            "queueMs": 155,
            "clientMs": 3263,
            "processedBytes": "12800",
            "billedBytes": "10485760",
            "slotMs": "108",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5bbdd2287edfffc07a8560dde29dc8234d924af8a5fc1f5f34d0881742f9efb4",
            "output": [
              {
                "mean_size": 1653640.2903225806,
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "53",
                "spilledBytes": "0",
                "slotMs": "95"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "12"
              }
            ]
          },
          {
            "jobMs": 2457,
            "queueMs": 168,
            "clientMs": 2911,
            "processedBytes": "12800",
            "billedBytes": "10485760",
            "slotMs": "490",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "5bbdd2287edfffc07a8560dde29dc8234d924af8a5fc1f5f34d0881742f9efb4",
            "output": [
              {
                "mean_size": 1653640.2903225806,
                "transactions": "657752"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "403",
                "recordsWritten": "3",
                "shuffleBytes": "53",
                "spilledBytes": "0",
                "slotMs": "423"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "66"
              }
            ]
          }
        ]
      }
    },
    "resultDigestFormat": "sdk-normalized-json-v1",
    "outputFormat": "Exact decimal text; original full-result digests retained from the captured SDK scalar representation."
  },
  "summaryVerification": {
    "verifiedAt": "2026-10-04T03:56:36.699Z",
    "maximumBytesBilled": "300000000",
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
