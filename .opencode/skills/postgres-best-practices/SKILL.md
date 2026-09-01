# PostgreSQL Best Practices

## Query Patterns
- Use parameterized queries
- Always include group_id filter
- Prefer batch operations
- Implement connection pooling

## Schema Design
- Append-only events table
- JSONB for flexible metadata
- Proper indexing on group_id, agent_id
- Partition by date for large tables

## Example
```sql
-- Good: Parameterized with group_id
SELECT * FROM events 
WHERE group_id = $1 AND agent_id = $2;

-- Bad: Missing group_id
SELECT * FROM events WHERE agent_id = 'brooks';
```
