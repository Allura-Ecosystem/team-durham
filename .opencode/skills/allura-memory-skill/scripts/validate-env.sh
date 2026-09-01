#!/bin/bash
# validate-env.sh — Check that Allura Brain environment is properly configured
# Uses direct Docker access for health checks; for memory operations, use MCP tools: allura-brain_memory_*

set -e

echo "=== Allura Brain Environment Validation ==="

# Check required env vars
for var in POSTGRES_HOST POSTGRES_PORT POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD NEO4J_URI NEO4J_USER NEO4J_PASSWORD; do
  if [ -z "${!var}" ]; then
    echo "❌ MISSING: $var"
  else
    echo "✅ $var = ${!var}"
  fi
done

# Check defaults
echo ""
echo "=== Defaults ==="
echo "DEFAULT_GROUP_ID = ${DEFAULT_GROUP_ID:-allura-system}"
echo "PROMOTION_MODE = ${PROMOTION_MODE:-soc2}"
echo "AUTO_APPROVAL_THRESHOLD = ${AUTO_APPROVAL_THRESHOLD:-0.85}"
echo "EMBEDDING_BASE_URL = ${EMBEDDING_BASE_URL:-http://localhost:11434}"

# Check Docker containers
echo ""
echo "=== Docker Containers ==="
for container in knowledge-postgres knowledge-neo4j; do
  if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
    echo "✅ $container running"
  else
    echo "❌ $container NOT running"
  fi
done