#!/bin/bash
# smoke-test-memory.sh — Quick smoke test for Allura Brain memory operations
# Uses direct Docker access for health checks; for memory operations, use MCP tools: allura-brain_memory_*

set -e

echo "=== Allura Brain Smoke Test ==="

# Test PostgreSQL
echo "Testing PostgreSQL..."
PG_COUNT=$(docker exec knowledge-postgres psql -U ronin4life -d memory -t -c "SELECT count(*) FROM allura_memories;" 2>/dev/null | tr -d ' ')
echo "  PG memories: $PG_COUNT"

# Test Neo4j
echo "Testing Neo4j..."
NEO4J_COUNT=$(docker exec knowledge-neo4j cypher-shell -u neo4j -p 'Kamina2026*' "MATCH (m:Memory) RETURN count(m)" 2>/dev/null | tail -2 | head -1 | tr -d ' ')
echo "  Neo4j Memory nodes: $NEO4J_COUNT"

# Test Ollama
echo "Testing Ollama..."
if curl -s http://localhost:11434/api/tags | grep -q qwen3; then
  echo "  ✅ qwen3-embedding:8b available"
else
  echo "  ❌ qwen3-embedding:8b not found in Ollama"
fi

# Test MCP server (if accessible)
echo "Testing MCP HTTP gateway..."
if curl -s http://localhost:3201/ready 2>/dev/null | grep -q "ok\|ready\|healthy"; then
  echo "  ✅ HTTP gateway responding"
else
  echo "  ⚠️  HTTP gateway not responding (may not be mapped to host)"
fi

echo ""
echo "=== Done ==="