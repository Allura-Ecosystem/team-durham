# Allura Troubleshooting

## MCP layer

| Symptom | Check |
|---------|-------|
| `allura-brain_memory_search` returns empty | Is `group_id` set to `allura-system`? |
| MCP tools not available | Has `memory` MCP server been added? Use `MCP_DOCKER_mcp-find` and `MCP_DOCKER_mcp-add` |
| Connection timeout | Is the MCP runtime reachable? Verify container health with `docker compose ps` |
| Auth failure | Check `.env` for `POSTGRES_PASSWORD` and `NEO4J_PASSWORD` |

## PostgreSQL layer

| Symptom | Check |
|---------|-------|
| "role does not exist" | User should be `ronin4life`, database `memory` |
| Embedding projection fails | Is Ollama running on host? `curl http://localhost:11434/api/tags` |
| Empty search results | Is `qwen3-embedding:8b` model pulled? Check `DEFAULT_GROUP_ID` env var |
| HNSW index missing | pgvector 0.8.2 has 2000d limit; needs 0.8.4+ for 4096d HNSW |

## Neo4j layer

| Symptom | Check |
|---------|-------|
| "unauthorized" | Password should be in `.env` as `NEO4J_PASSWORD` |
| Empty graph results | Is `group_id` correct? Are nodes under `allura-system`? |
| Schema errors | Run `scripts/neo4j-memory-indexes.cypher` to rebuild indexes |
| Container crash-looping | Check HEAP_MAX (should be 512m max for 2GB container limit) |

## Embedding layer

| Symptom | Check |
|---------|-------|
| Slow embedding | First call warms up `qwen3-embedding:8b` (4.6GB model) |
| Timeout on embed | Increase `EMBEDDING_TIMEOUT`; check `EMBEDDING_BASE_URL` points to Ollama |
| Dimension mismatch | Current: 4096d. If you see 768d errors, old model is still configured somewhere |

## Docker layer

| Symptom | Check |
|---------|-------|
| Container missing | Run `docker compose up -d` from project root |
| Build failure on skill dirs | Check `.opencode/skills/skill-*` directories exist (not just in `_archived/`) |
| Healthcheck failing | MCP healthcheck uses `pgrep` which doesn't exist in Bun image — cosmetic, server still works |
| Port conflicts | PG: 5432, Neo4j: 7687/7474, MCP HTTP: 3201, Web: 3100 |

## Quick health check

```bash
# All containers
docker compose ps

# PostgreSQL
docker exec knowledge-postgres psql -U ronin4life -d memory -c "SELECT count(*) FROM allura_memories;"

# Neo4j
docker exec knowledge-neo4j cypher-shell -u neo4j -p 'Kamina2026*' "MATCH (m:Memory) RETURN count(m)"

# Ollama
curl http://localhost:11434/api/tags | grep qwen3
```