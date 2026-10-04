const source = '`bigquery-public-data.google_trends.top_terms`';
const select = 'SELECT COUNT(*) AS `rows`, SUM(score) AS score_total\nFROM '+source+'\n';
export const storageQueries = {
  partitionWeek: select+"WHERE refresh_date BETWEEN DATE('2026-09-25') AND DATE('2026-10-01');",
  partitionDay: select+"WHERE refresh_date = DATE('2026-10-01');",
  partitionFunction: select+"WHERE FORMAT_DATE('%Y-%m-%d', refresh_date) = '2026-10-01';",
};
