---
title: "SQL Query Craft"
category: dbms
part: "PART 4 — DBMS, SQL & DATA MODELLING"
number: "4.2"
order: 4.2
priority: P0
status: not-started
source: 00_MASTER_TOPIC_LIST.md
---

- [ ] Logical execution order: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT
- [ ] Joins: INNER, LEFT, RIGHT, FULL, CROSS, SELF; anti-join and semi-join patterns (`NOT EXISTS`, `LEFT JOIN ... IS NULL`)
- [ ] Aggregations, GROUP BY, HAVING vs WHERE
- [ ] Subqueries: scalar, correlated (and why they're slow), derived tables
- [ ] CTEs (`WITH`), recursive CTEs (org hierarchies, tree traversal)
- [ ] **Window functions** 🔴: `ROW_NUMBER`, `RANK`, `DENSE_RANK`, `LAG`/`LEAD`, `SUM() OVER`, `PARTITION BY`, frames (`ROWS BETWEEN`) — top-N-per-group is the classic interview question
- [ ] `UNION` vs `UNION ALL`; `INTERSECT`, `EXCEPT`
- [ ] `CASE WHEN`, COALESCE, NULLIF; three-valued logic & NULL comparison traps
- [ ] Upserts: `INSERT ... ON CONFLICT` (Postgres), `ON DUPLICATE KEY UPDATE` (MySQL), MERGE
- [ ] Pagination: OFFSET vs keyset/cursor pagination (and why OFFSET degrades at scale)
- [ ] Views vs materialized views (and refresh strategies)
- [ ] Stored procedures, functions, triggers — and why teams often avoid them
- [ ] Classic query problems: Nth highest salary, duplicates, running totals, gaps & islands, employees earning more than manager, department top earners, consecutive dates, pivot
