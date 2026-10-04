// Reviewed Bakiano subset and pre-run query statistics. No warehouse access from the browser.
export const measurements = {
  "kind": "recorded-bakiano-subset",
  "capturedAt": "2026-10-04T20:57:43.24Z",
  "location": "US",
  "useQueryCache": false,
  "queries": {
    "latestSubquery": {
      "sql": "SELECT COUNT(*) AS observations, COUNT(DISTINCT source) AS chains\nFROM `YOUR_PROJECT.raw_supermarket.products`\nWHERE ingestion_date = (SELECT MAX(ingestion_date) FROM `YOUR_PROJECT.raw_supermarket.products`)\n  AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%';",
      "bytes": "826704750",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "chains",
          "type": "INTEGER"
        }
      ]
    },
    "latestBound": {
      "sql": "SELECT COUNT(*) AS observations, COUNT(DISTINCT source) AS chains\nFROM `YOUR_PROJECT.raw_supermarket.products`\nWHERE ingestion_date = DATE '2026-10-04'\n  AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%';",
      "bytes": "3664924",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "chains",
          "type": "INTEGER"
        }
      ]
    },
    "history": {
      "sql": "SELECT COUNT(*) AS observations, COUNT(DISTINCT source) AS chains\nFROM `YOUR_PROJECT.raw_supermarket.products`\nWHERE ingestion_date BETWEEN DATE_SUB(DATE '2026-10-04', INTERVAL 29 DAY) AND DATE '2026-10-04'\n  AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%';",
      "bytes": "111916408",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "chains",
          "type": "INTEGER"
        }
      ]
    },
    "allColumns": {
      "sql": "SELECT *\nFROM `YOUR_PROJECT.raw_supermarket.products`\nWHERE ingestion_date = DATE '2026-10-04'\n  AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'\nORDER BY source, product_id\nLIMIT 20;",
      "bytes": "18710516",
      "schema": [
        {
          "name": "product_id",
          "type": "STRING"
        },
        {
          "name": "source",
          "type": "STRING"
        },
        {
          "name": "product_name",
          "type": "STRING"
        },
        {
          "name": "category",
          "type": "STRING"
        },
        {
          "name": "price_current",
          "type": "FLOAT"
        },
        {
          "name": "currency",
          "type": "STRING"
        },
        {
          "name": "in_stock",
          "type": "BOOLEAN"
        },
        {
          "name": "product_code",
          "type": "STRING"
        },
        {
          "name": "url",
          "type": "STRING"
        },
        {
          "name": "scraped_at",
          "type": "TIMESTAMP"
        },
        {
          "name": "ingestion_date",
          "type": "DATE"
        },
        {
          "name": "vendor_id",
          "type": "INTEGER"
        },
        {
          "name": "file_path",
          "type": "STRING"
        }
      ]
    },
    "selectedColumns": {
      "sql": "SELECT source, product_name, price_current\nFROM `YOUR_PROJECT.raw_supermarket.products`\nWHERE ingestion_date = DATE '2026-10-04'\n  AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'\nORDER BY source, product_id\nLIMIT 20;",
      "bytes": "6297106",
      "schema": [
        {
          "name": "source",
          "type": "STRING"
        },
        {
          "name": "product_name",
          "type": "STRING"
        },
        {
          "name": "price_current",
          "type": "FLOAT"
        }
      ]
    },
    "fewerRows": {
      "sql": "SELECT *\nFROM `YOUR_PROJECT.raw_supermarket.products`\nWHERE ingestion_date = DATE '2026-10-04'\n  AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'\nORDER BY source, product_id\nLIMIT 5;",
      "bytes": "18710516",
      "schema": [
        {
          "name": "product_id",
          "type": "STRING"
        },
        {
          "name": "source",
          "type": "STRING"
        },
        {
          "name": "product_name",
          "type": "STRING"
        },
        {
          "name": "category",
          "type": "STRING"
        },
        {
          "name": "price_current",
          "type": "FLOAT"
        },
        {
          "name": "currency",
          "type": "STRING"
        },
        {
          "name": "in_stock",
          "type": "BOOLEAN"
        },
        {
          "name": "product_code",
          "type": "STRING"
        },
        {
          "name": "url",
          "type": "STRING"
        },
        {
          "name": "scraped_at",
          "type": "TIMESTAMP"
        },
        {
          "name": "ingestion_date",
          "type": "DATE"
        },
        {
          "name": "vendor_id",
          "type": "INTEGER"
        },
        {
          "name": "file_path",
          "type": "STRING"
        }
      ]
    },
    "dateFunction": {
      "sql": "SELECT COUNT(*) AS observations, COUNT(DISTINCT source) AS chains\nFROM `YOUR_PROJECT.raw_supermarket.products`\nWHERE FORMAT_DATE('%Y-%m-%d', ingestion_date) = '2026-10-04'\n  AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%';",
      "bytes": "826704750",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "chains",
          "type": "INTEGER"
        }
      ]
    },
    "joinId": {
      "sql": "SELECT COUNT(*) AS observations, COUNTIF(e.schema_version = 4) AS classified\nFROM `YOUR_PROJECT.raw_supermarket.products` p\nLEFT JOIN `YOUR_PROJECT.enriched_supermarket.products` e\n  ON p.product_id = e.product_id\nWHERE p.ingestion_date = DATE '2026-10-04'\n  AND LOWER(p.product_name) LIKE '%leche%' AND LOWER(p.product_name) LIKE '%carabobo%';",
      "bytes": "17802133",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "classified",
          "type": "INTEGER"
        }
      ]
    },
    "joinSource": {
      "sql": "SELECT COUNT(*) AS observations, COUNTIF(e.schema_version = 4) AS classified\nFROM `YOUR_PROJECT.raw_supermarket.products` p\nLEFT JOIN `YOUR_PROJECT.enriched_supermarket.products` e\n  ON p.product_id = e.product_id AND p.source = e.source\nWHERE p.ingestion_date = DATE '2026-10-04'\n  AND LOWER(p.product_name) LIKE '%leche%' AND LOWER(p.product_name) LIKE '%carabobo%';",
      "bytes": "21037534",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "classified",
          "type": "INTEGER"
        }
      ]
    },
    "unionAll": {
      "sql": "WITH milk AS (\n  SELECT source, product_id FROM `YOUR_PROJECT.raw_supermarket.products`\n  WHERE ingestion_date = DATE '2026-10-04'\n    AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'\n), listings AS (\n  SELECT * FROM milk\n  UNION ALL\n  SELECT * FROM milk\n)\nSELECT COUNT(*) AS observations FROM listings;",
      "bytes": "3079217",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        }
      ]
    },
    "unionDistinct": {
      "sql": "WITH milk AS (\n  SELECT source, product_id FROM `YOUR_PROJECT.raw_supermarket.products`\n  WHERE ingestion_date = DATE '2026-10-04'\n    AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'\n), listings AS (\n  SELECT * FROM milk\n  UNION DISTINCT\n  SELECT * FROM milk\n)\nSELECT COUNT(*) AS observations FROM listings;",
      "bytes": "5796282",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        }
      ]
    },
    "cteRepeated": {
      "sql": "WITH today AS (\n  SELECT source, product_id FROM `YOUR_PROJECT.raw_supermarket.products`\n  WHERE ingestion_date = DATE '2026-10-04'\n    AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'\n)\nSELECT (SELECT COUNT(*) FROM today) AS observations,\n  (SELECT COUNT(DISTINCT source) FROM today) AS chains;",
      "bytes": "3664924",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "chains",
          "type": "INTEGER"
        }
      ]
    },
    "cteOnce": {
      "sql": "WITH today AS (\n  SELECT source, product_id FROM `YOUR_PROJECT.raw_supermarket.products`\n  WHERE ingestion_date = DATE '2026-10-04'\n    AND LOWER(product_name) LIKE '%leche%' AND LOWER(product_name) LIKE '%carabobo%'\n)\nSELECT COUNT(*) AS observations, COUNT(DISTINCT source) AS chains\nFROM today;",
      "bytes": "3664924",
      "schema": [
        {
          "name": "observations",
          "type": "INTEGER"
        },
        {
          "name": "chains",
          "type": "INTEGER"
        }
      ]
    }
  },
  "experiments": [
    {
      "id": "latest",
      "label": "Latest-day lookup",
      "question": "How many matching Carabobo listings and chains are in our latest loaded day?",
      "variants": [
        "latestSubquery",
        "latestBound"
      ],
      "choices": [
        "Find latest day inside query",
        "Bind the resolved data date"
      ],
      "maxRows": [
        1,
        1
      ],
      "baseline": "latestSubquery",
      "group": "market",
      "lesson": "Both request the same milk subset and day. Resolving the date first lets the main query target one partition. The separate date lookup has its own cost.",
      "tradeoff": "Compare MAX(ingestion_date) inside the query with a date resolved before the price query, as our app does.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Compare MAX(ingestion_date) inside the query with a date resolved before the price query, as our app does.",
        "meaning": "Both return the same four matching listings across three chains. Binding the resolved date targets one partition. The separate date lookup has its own cost."
      }
    },
    {
      "id": "market-window",
      "label": "Price history window",
      "question": "How much history do we read for one day versus a 30-day chart?",
      "variants": [
        "history",
        "latestBound"
      ],
      "choices": [
        "30 days of observations",
        "Latest day only"
      ],
      "maxRows": [
        1,
        1
      ],
      "baseline": "history",
      "group": "market",
      "lesson": "The totals cover different time windows. The smaller query cannot replace a 30-day price chart.",
      "tradeoff": "Read 30 daily partitions or only the latest loaded day.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Read 30 daily partitions or only the latest loaded day.",
        "meaning": "The totals cover different time windows. The smaller query cannot replace a 30-day price chart."
      }
    },
    {
      "id": "market-columns",
      "label": "Fields for a price card",
      "question": "Which fields should a supermarket price card request?",
      "variants": [
        "allColumns",
        "selectedColumns"
      ],
      "choices": [
        "Full raw product row",
        "Name, chain and scraped price"
      ],
      "maxRows": [
        20,
        20
      ],
      "baseline": "allColumns",
      "group": "market",
      "lesson": "Raw prices are as scraped, with vendor-dependent currencies. These are not comparable USD prices until our currency conversion layer runs.",
      "tradeoff": "Keep the same date, ordering and 20-row limit; select only the three fields needed by the card.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Keep the same date, ordering and 20-row limit; select only the three fields needed by the card.",
        "meaning": "Raw prices are as scraped, with vendor-dependent currencies. These are not comparable USD prices until our currency conversion layer runs."
      }
    },
    {
      "id": "market-join",
      "label": "Enrichment identity",
      "question": "How should a scraped listing join its enrichment record?",
      "variants": [
        "joinId",
        "joinSource"
      ],
      "choices": [
        "Product ID alone",
        "Chain plus product ID"
      ],
      "maxRows": [
        1,
        1
      ],
      "baseline": "joinId",
      "group": "market",
      "lesson": "Both produce eight joined rows from four input listings because enrichment has multiple schema versions. This case isolates join identity; our serving query also pins schema version 4.",
      "tradeoff": "Include the source in the enrichment join, as the application does.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Include the source in the enrichment join, as the application does.",
        "meaning": "Both produce eight joined rows from four input listings because enrichment has multiple schema versions. This case isolates join identity; our serving query also pins schema version 4."
      }
    },
    {
      "id": "market-union",
      "label": "Repeated source batches",
      "question": "What happens if the same milk listing batch enters twice?",
      "variants": [
        "unionAll",
        "unionDistinct"
      ],
      "choices": [
        "Keep both copies",
        "Deduplicate selected identities"
      ],
      "maxRows": [
        1,
        1
      ],
      "baseline": "unionAll",
      "group": "market",
      "lesson": "DISTINCT removes repeated selected identities. It does not decide whether listings across different chains are the same real-world product.",
      "tradeoff": "Combine two copies of the same source batch with UNION ALL or UNION DISTINCT.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Combine two copies of the same source batch with UNION ALL or UNION DISTINCT.",
        "meaning": "DISTINCT removes repeated selected identities. It does not decide whether listings across different chains are the same real-world product."
      }
    },
    {
      "id": "market-cte",
      "label": "Repeated query expression",
      "question": "Can we calculate observation and chain counts in one aggregate?",
      "variants": [
        "cteRepeated",
        "cteOnce"
      ],
      "choices": [
        "Two nested scalar queries",
        "One aggregate"
      ],
      "maxRows": [
        1,
        1
      ],
      "baseline": "cteRepeated",
      "group": "market",
      "lesson": "Both target the same counts. WITH does not guarantee an intermediate cache; inspect the measured execution stages.",
      "tradeoff": "Reuse the same date-filtered WITH expression in two scalar subqueries or calculate both counts together.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Reuse the same date-filtered WITH expression in two scalar subqueries or calculate both counts together.",
        "meaning": "Both target the same counts. WITH does not guarantee an intermediate cache; inspect the measured execution stages."
      }
    },
    {
      "id": "market-limit",
      "label": "Preview size",
      "question": "Does showing five milk listings instead of twenty reduce the scan?",
      "variants": [
        "allColumns",
        "fewerRows"
      ],
      "choices": [
        "20 preview rows",
        "5 preview rows"
      ],
      "maxRows": [
        20,
        5
      ],
      "baseline": "allColumns",
      "group": "market",
      "lesson": "LIMIT controls the maximum preview size. This subset has only four rows, so both limits return all four. It does not promise less reading.",
      "tradeoff": "Keep the same subset, day and selected fields; reduce only the returned row limit.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Keep the same subset, day and selected fields; reduce only the returned row limit.",
        "meaning": "LIMIT controls the maximum preview size. This subset has only four rows, so both limits return all four. It does not promise less reading."
      }
    },
    {
      "id": "market-predicate",
      "label": "Partition predicate",
      "question": "How do two date predicates affect reading the same milk subset?",
      "variants": [
        "dateFunction",
        "latestBound"
      ],
      "choices": [
        "Format the partition date",
        "Direct date equality"
      ],
      "maxRows": [
        1,
        1
      ],
      "baseline": "dateFunction",
      "group": "market",
      "lesson": "Both request the same data date. Use the recorded estimate to check pruning rather than guessing from the SQL syntax.",
      "tradeoff": "Compare FORMAT_DATE on ingestion_date with direct date equality.",
      "docs": "https://docs.cloud.google.com/bigquery/docs/best-practices-performance-compute",
      "context": {
        "data": "Frozen Bakiano subset · Carabobo listings matching leche · 2026-10-04",
        "change": "Compare FORMAT_DATE on ingestion_date with direct date equality.",
        "meaning": "Both request the same data date. Use the recorded estimate to check pruning rather than guessing from the SQL syntax."
      }
    }
  ],
  "groups": [
    {
      "id": "market",
      "label": "Bakiano warehouse"
    }
  ],
  "sources": {
    "YOUR_PROJECT.raw_supermarket.products": {
      "type": "TABLE",
      "partitioning": {
        "type": "DAY",
        "field": "ingestion_date"
      }
    },
    "YOUR_PROJECT.enriched_supermarket.products": {
      "type": "TABLE",
      "partitioning": null
    }
  },
  "input": {
    "name": "Carabobo listings matching leche",
    "date": "2026-10-04",
    "rows": [
      {
        "source": "farmatodo",
        "product_name": "Leche Entera Carabobo x 200 ml",
        "price_current": 1416
      },
      {
        "source": "locatel",
        "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
        "price_current": 3177.81
      },
      {
        "source": "plansuarez",
        "product_name": "LECHE CARABOBO 200ML ENTERA",
        "price_current": 772.87
      },
      {
        "source": "plansuarez",
        "product_name": "CREMA DE LECHE PARISIENNE 200ML CARABOBO",
        "price_current": 2912.83
      }
    ],
    "note": "Frozen latest-day preview of the name-filtered subset. Packs and formulations differ; these are not verified matches of one SKU. Prices are as scraped, not USD. Query scan bytes cover the original partitioned warehouse, not this small preview."
  },
  "benchmarks": {
    "capturedAt": "2026-10-04T20:58:29.808Z",
    "samples": 3,
    "maximumBytesBilled": "1000000000",
    "totalReservationLimit": "12000000000",
    "reservedBytes": "9450000000",
    "results": {
      "latestSubquery": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "1000000000",
            "jobMs": 702,
            "queueMs": 96,
            "clientMs": 1259,
            "processedBytes": "120435508",
            "billedBytes": "120586240",
            "slotMs": "10987",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
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
                "recordsRead": "14596323",
                "recordsWritten": "323",
                "shuffleBytes": "1615",
                "spilledBytes": "0",
                "slotMs": "7341"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "323",
                "recordsWritten": "1",
                "shuffleBytes": "5",
                "spilledBytes": "0",
                "slotMs": "62"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "62692",
                "recordsWritten": "4",
                "shuffleBytes": "114",
                "spilledBytes": "0",
                "slotMs": "3157"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "4",
                "shuffleBytes": "84",
                "spilledBytes": "0",
                "slotMs": "358"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "3",
                "shuffleBytes": "22",
                "spilledBytes": "0",
                "slotMs": "46"
              },
              {
                "id": "5",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "20"
              }
            ]
          },
          {
            "maximumBytesBilled": "1000000000",
            "jobMs": 589,
            "queueMs": 110,
            "clientMs": 1101,
            "processedBytes": "120435508",
            "billedBytes": "120586240",
            "slotMs": "4819",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
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
                "recordsRead": "14596323",
                "recordsWritten": "323",
                "shuffleBytes": "1615",
                "spilledBytes": "0",
                "slotMs": "3421"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "323",
                "recordsWritten": "1",
                "shuffleBytes": "5",
                "spilledBytes": "0",
                "slotMs": "23"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "62692",
                "recordsWritten": "4",
                "shuffleBytes": "114",
                "spilledBytes": "0",
                "slotMs": "101"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "4",
                "shuffleBytes": "84",
                "spilledBytes": "0",
                "slotMs": "1030"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "3",
                "shuffleBytes": "22",
                "spilledBytes": "0",
                "slotMs": "145"
              },
              {
                "id": "5",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "96"
              }
            ]
          },
          {
            "maximumBytesBilled": "1000000000",
            "jobMs": 583,
            "queueMs": 110,
            "clientMs": 1103,
            "processedBytes": "120435508",
            "billedBytes": "120586240",
            "slotMs": "3895",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
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
                "recordsRead": "14596323",
                "recordsWritten": "323",
                "shuffleBytes": "1615",
                "spilledBytes": "0",
                "slotMs": "3472"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "323",
                "recordsWritten": "1",
                "shuffleBytes": "5",
                "spilledBytes": "0",
                "slotMs": "53"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "62692",
                "recordsWritten": "4",
                "shuffleBytes": "114",
                "spilledBytes": "0",
                "slotMs": "117"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "4",
                "shuffleBytes": "84",
                "spilledBytes": "0",
                "slotMs": "189"
              },
              {
                "id": "4",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "3",
                "shuffleBytes": "22",
                "spilledBytes": "0",
                "slotMs": "39"
              },
              {
                "id": "5",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "21"
              }
            ]
          }
        ]
      },
      "latestBound": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 213,
            "queueMs": 86,
            "clientMs": 1093,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "80",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "80"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 185,
            "queueMs": 137,
            "clientMs": 724,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "78",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "78"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 237,
            "queueMs": 65,
            "clientMs": 965,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "72",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "72"
              }
            ]
          }
        ]
      },
      "history": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "150000000",
            "jobMs": 342,
            "queueMs": 109,
            "clientMs": 901,
            "processedBytes": "111916408",
            "billedBytes": "112197632",
            "slotMs": "1542",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "0b45dae54d67cb94f0d7d2ce14f3021b51def68fca1c9fd4e23c64e53339d5b8",
            "output": [
              {
                "chains": "5",
                "observations": "166"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "1915780",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "1542"
              }
            ]
          },
          {
            "maximumBytesBilled": "150000000",
            "jobMs": 240,
            "queueMs": 105,
            "clientMs": 745,
            "processedBytes": "111916408",
            "billedBytes": "112197632",
            "slotMs": "1406",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "0b45dae54d67cb94f0d7d2ce14f3021b51def68fca1c9fd4e23c64e53339d5b8",
            "output": [
              {
                "chains": "5",
                "observations": "166"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "1915780",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "1406"
              }
            ]
          },
          {
            "maximumBytesBilled": "150000000",
            "jobMs": 452,
            "queueMs": 104,
            "clientMs": 963,
            "processedBytes": "111916408",
            "billedBytes": "112197632",
            "slotMs": "1756",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "0b45dae54d67cb94f0d7d2ce14f3021b51def68fca1c9fd4e23c64e53339d5b8",
            "output": [
              {
                "chains": "5",
                "observations": "166"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "1915780",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "1756"
              }
            ]
          }
        ]
      },
      "allColumns": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 185,
            "queueMs": 60,
            "clientMs": 687,
            "processedBytes": "18710516",
            "billedBytes": "18874368",
            "slotMs": "92",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "04afbdc4ea86f6779c18591147fb6cac6cf3b5987c4fcdb3a357c16d4a9c65cc",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "1307",
                "spilledBytes": "0",
                "slotMs": "92"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 216,
            "queueMs": 97,
            "clientMs": 727,
            "processedBytes": "18710516",
            "billedBytes": "18874368",
            "slotMs": "134",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "04afbdc4ea86f6779c18591147fb6cac6cf3b5987c4fcdb3a357c16d4a9c65cc",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "1307",
                "spilledBytes": "0",
                "slotMs": "134"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 209,
            "queueMs": 116,
            "clientMs": 783,
            "processedBytes": "18710516",
            "billedBytes": "18874368",
            "slotMs": "120",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "04afbdc4ea86f6779c18591147fb6cac6cf3b5987c4fcdb3a357c16d4a9c65cc",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "1307",
                "spilledBytes": "0",
                "slotMs": "120"
              }
            ]
          }
        ]
      },
      "selectedColumns": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 206,
            "queueMs": 85,
            "clientMs": 693,
            "processedBytes": "6297106",
            "billedBytes": "10485760",
            "slotMs": "96",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "0a2c7a178e11bcea11c28a724e112d1ae4353f62f490232e81fa38eaafa73a45",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "255",
                "spilledBytes": "0",
                "slotMs": "96"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 213,
            "queueMs": 101,
            "clientMs": 1193,
            "processedBytes": "6297106",
            "billedBytes": "10485760",
            "slotMs": "89",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "0a2c7a178e11bcea11c28a724e112d1ae4353f62f490232e81fa38eaafa73a45",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "255",
                "spilledBytes": "0",
                "slotMs": "89"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 217,
            "queueMs": 88,
            "clientMs": 718,
            "processedBytes": "6297106",
            "billedBytes": "10485760",
            "slotMs": "101",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "0a2c7a178e11bcea11c28a724e112d1ae4353f62f490232e81fa38eaafa73a45",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "255",
                "spilledBytes": "0",
                "slotMs": "101"
              }
            ]
          }
        ]
      },
      "fewerRows": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 226,
            "queueMs": 70,
            "clientMs": 695,
            "processedBytes": "18710516",
            "billedBytes": "18874368",
            "slotMs": "82",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "04afbdc4ea86f6779c18591147fb6cac6cf3b5987c4fcdb3a357c16d4a9c65cc",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "1307",
                "spilledBytes": "0",
                "slotMs": "82"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 171,
            "queueMs": 115,
            "clientMs": 774,
            "processedBytes": "18710516",
            "billedBytes": "18874368",
            "slotMs": "109",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "04afbdc4ea86f6779c18591147fb6cac6cf3b5987c4fcdb3a357c16d4a9c65cc",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "1307",
                "spilledBytes": "0",
                "slotMs": "109"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 224,
            "queueMs": 117,
            "clientMs": 732,
            "processedBytes": "18710516",
            "billedBytes": "18874368",
            "slotMs": "145",
            "cacheHit": false,
            "rowCount": 4,
            "resultDigest": "04afbdc4ea86f6779c18591147fb6cac6cf3b5987c4fcdb3a357c16d4a9c65cc",
            "output": [
              {
                "price_current": 1416,
                "product_name": "Leche Entera Carabobo x 200 ml",
                "source": "farmatodo"
              },
              {
                "price_current": 3177.81,
                "product_name": "CARABOBO LECHE LIQUIDA ENTERA ESTERIL UHT 1 LT",
                "source": "locatel"
              },
              {
                "price_current": 772.87,
                "product_name": "LECHE CARABOBO 200ML ENTERA",
                "source": "plansuarez"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "SORT",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "4",
                "shuffleBytes": "1307",
                "spilledBytes": "0",
                "slotMs": "145"
              }
            ]
          }
        ]
      },
      "dateFunction": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "1000000000",
            "jobMs": 850,
            "queueMs": 46,
            "clientMs": 1280,
            "processedBytes": "826704750",
            "billedBytes": "827326464",
            "slotMs": "21655",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "14596323",
                "recordsWritten": "4",
                "shuffleBytes": "114",
                "spilledBytes": "0",
                "slotMs": "21192"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "4",
                "shuffleBytes": "84",
                "spilledBytes": "0",
                "slotMs": "345"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "3",
                "shuffleBytes": "22",
                "spilledBytes": "0",
                "slotMs": "92"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "25"
              }
            ]
          },
          {
            "maximumBytesBilled": "1000000000",
            "jobMs": 539,
            "queueMs": 79,
            "clientMs": 1070,
            "processedBytes": "826704750",
            "billedBytes": "827326464",
            "slotMs": "11285",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "14596323",
                "recordsWritten": "4",
                "shuffleBytes": "114",
                "spilledBytes": "0",
                "slotMs": "10810"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "4",
                "shuffleBytes": "84",
                "spilledBytes": "0",
                "slotMs": "358"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "3",
                "shuffleBytes": "22",
                "spilledBytes": "0",
                "slotMs": "91"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "24"
              }
            ]
          },
          {
            "maximumBytesBilled": "1000000000",
            "jobMs": 569,
            "queueMs": 62,
            "clientMs": 1032,
            "processedBytes": "826704750",
            "billedBytes": "827326464",
            "slotMs": "10852",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "14596323",
                "recordsWritten": "4",
                "shuffleBytes": "114",
                "spilledBytes": "0",
                "slotMs": "10450"
              },
              {
                "id": "1",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "4",
                "shuffleBytes": "84",
                "spilledBytes": "0",
                "slotMs": "357"
              },
              {
                "id": "2",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "WRITE"
                ],
                "recordsRead": "4",
                "recordsWritten": "3",
                "shuffleBytes": "22",
                "spilledBytes": "0",
                "slotMs": "23"
              },
              {
                "id": "3",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "3",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "22"
              }
            ]
          }
        ]
      },
      "joinId": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 263,
            "queueMs": 134,
            "clientMs": 812,
            "processedBytes": "17802133",
            "billedBytes": "20971520",
            "slotMs": "395",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "6ba2a87a0428b7517845887e27fe290d891fa34bd237d7b8dcd0496c6934f7d3",
            "output": [
              {
                "classified": "4",
                "observations": "8"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "362486",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "395"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 331,
            "queueMs": 117,
            "clientMs": 849,
            "processedBytes": "17802133",
            "billedBytes": "20971520",
            "slotMs": "279",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "6ba2a87a0428b7517845887e27fe290d891fa34bd237d7b8dcd0496c6934f7d3",
            "output": [
              {
                "classified": "4",
                "observations": "8"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "362486",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "279"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 341,
            "queueMs": 51,
            "clientMs": 832,
            "processedBytes": "17802133",
            "billedBytes": "20971520",
            "slotMs": "353",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "6ba2a87a0428b7517845887e27fe290d891fa34bd237d7b8dcd0496c6934f7d3",
            "output": [
              {
                "classified": "4",
                "observations": "8"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "362486",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "353"
              }
            ]
          }
        ]
      },
      "joinSource": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 294,
            "queueMs": 97,
            "clientMs": 861,
            "processedBytes": "21037534",
            "billedBytes": "22020096",
            "slotMs": "316",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "6ba2a87a0428b7517845887e27fe290d891fa34bd237d7b8dcd0496c6934f7d3",
            "output": [
              {
                "classified": "4",
                "observations": "8"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "362486",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "316"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 267,
            "queueMs": 102,
            "clientMs": 832,
            "processedBytes": "21037534",
            "billedBytes": "22020096",
            "slotMs": "407",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "6ba2a87a0428b7517845887e27fe290d891fa34bd237d7b8dcd0496c6934f7d3",
            "output": [
              {
                "classified": "4",
                "observations": "8"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "362486",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "407"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 303,
            "queueMs": 119,
            "clientMs": 864,
            "processedBytes": "21037534",
            "billedBytes": "22020096",
            "slotMs": "344",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "6ba2a87a0428b7517845887e27fe290d891fa34bd237d7b8dcd0496c6934f7d3",
            "output": [
              {
                "classified": "4",
                "observations": "8"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "AGGREGATE",
                  "COMPUTE",
                  "JOIN",
                  "WRITE"
                ],
                "recordsRead": "362486",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "344"
              }
            ]
          }
        ]
      },
      "unionAll": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 179,
            "queueMs": 89,
            "clientMs": 666,
            "processedBytes": "3079217",
            "billedBytes": "10485760",
            "slotMs": "113",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "75cb716bd4ed7764f57d5ad463c0243283727992400b91fc74d05d6274550cce",
            "output": [
              {
                "observations": "8"
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
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "113"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 198,
            "queueMs": 97,
            "clientMs": 705,
            "processedBytes": "3079217",
            "billedBytes": "10485760",
            "slotMs": "151",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "75cb716bd4ed7764f57d5ad463c0243283727992400b91fc74d05d6274550cce",
            "output": [
              {
                "observations": "8"
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
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "151"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 268,
            "queueMs": 72,
            "clientMs": 755,
            "processedBytes": "3079217",
            "billedBytes": "10485760",
            "slotMs": "143",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "75cb716bd4ed7764f57d5ad463c0243283727992400b91fc74d05d6274550cce",
            "output": [
              {
                "observations": "8"
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
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "143"
              }
            ]
          }
        ]
      },
      "unionDistinct": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 283,
            "queueMs": 200,
            "clientMs": 913,
            "processedBytes": "5796282",
            "billedBytes": "10485760",
            "slotMs": "150",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "0ea297d619699993bbc958a5a196b764aa4c2fb539beea4819bf5a821b97cdef",
            "output": [
              {
                "observations": "4"
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
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "150"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 225,
            "queueMs": 107,
            "clientMs": 743,
            "processedBytes": "5796282",
            "billedBytes": "10485760",
            "slotMs": "145",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "0ea297d619699993bbc958a5a196b764aa4c2fb539beea4819bf5a821b97cdef",
            "output": [
              {
                "observations": "4"
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
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "145"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 211,
            "queueMs": 62,
            "clientMs": 779,
            "processedBytes": "5796282",
            "billedBytes": "10485760",
            "slotMs": "157",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "0ea297d619699993bbc958a5a196b764aa4c2fb539beea4819bf5a821b97cdef",
            "output": [
              {
                "observations": "4"
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
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "9",
                "spilledBytes": "0",
                "slotMs": "157"
              }
            ]
          }
        ]
      },
      "cteRepeated": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 186,
            "queueMs": 557,
            "clientMs": 1153,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "171",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "JOIN",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "171"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 227,
            "queueMs": 106,
            "clientMs": 804,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "133",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "JOIN",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "133"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 215,
            "queueMs": 66,
            "clientMs": 1248,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "109",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "JOIN",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "125374",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "109"
              }
            ]
          }
        ]
      },
      "cteOnce": {
        "status": "complete",
        "runs": [
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 197,
            "queueMs": 92,
            "clientMs": 732,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "130",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "130"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 203,
            "queueMs": 89,
            "clientMs": 711,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "79",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "79"
              }
            ]
          },
          {
            "maximumBytesBilled": "100000000",
            "jobMs": 211,
            "queueMs": 65,
            "clientMs": 659,
            "processedBytes": "3664924",
            "billedBytes": "10485760",
            "slotMs": "104",
            "cacheHit": false,
            "rowCount": 1,
            "resultDigest": "7f1bc8dfa3db829b9542d71aabc04aeb98cb3d4a519c9590868d8e063b7a2c0e",
            "output": [
              {
                "chains": "3",
                "observations": "4"
              }
            ],
            "stages": [
              {
                "id": "0",
                "operations": [
                  "READ",
                  "COMPUTE",
                  "AGGREGATE",
                  "WRITE"
                ],
                "recordsRead": "62687",
                "recordsWritten": "1",
                "shuffleBytes": "17",
                "spilledBytes": "0",
                "slotMs": "104"
              }
            ]
          }
        ]
      }
    }
  }
};
