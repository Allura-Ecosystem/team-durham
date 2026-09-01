#!/usr/bin/env bash
# smoke-test-memory.sh — End-to-end store/search/promote/revoke sanity check
# Usage: ./scripts/smoke-test-memory.sh
# Requires: Allura Brain tools available in current session (memory_*, MCP_DOCKER_*)
# Exit codes: 0 = all tests pass, 1 = partial failure, 2 = critical failure

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
SKIP=0
GROUP_ID="allura-team-durham"
TEST_USER="kotler"
TIMESTAMP=$(date -u +"%Y%m%dT%H%M%SZ")
TEST_PREFIX="SMOKE_${TIMESTAMP}"

echo "╔══════════════════════════════════════════════════════════╗"
echo "║         Allura Brain — Memory Smoke Test                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Test prefix: ${TEST_PREFIX}"
echo "Group ID:    ${GROUP_ID}"
echo "Timestamp:   ${TIMESTAMP}"
echo ""

# ─── Pre-flight ───

echo -e "${BLUE}PRE-FLIGHT${NC} Checking environment..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -f "${SCRIPT_DIR}/validate-env.sh" ]]; then
    bash "${SCRIPT_DIR}/validate-env.sh"
    env_result=$?
    if [[ $env_result -eq 2 ]]; then
        echo -e "${RED}ABORT${NC} Environment validation failed. Cannot run smoke tests."
        exit 2
    fi
else
    echo -e "${YELLOW}SKIP${NC} validate-env.sh not found, proceeding without pre-flight"
    SKIP=$((SKIP + 1))
fi
echo ""

# ─── Helper Functions ───

# Note: These tests are designed to be run by an agent that has access to
# the allura-brain_* and MCP_DOCKER_* tools. When run as a standalone
# shell script, they produce documentation of what should be tested.
# When run by an agent, the agent should execute the corresponding tool calls.

pass() {
    echo -e "  ${GREEN}PASS${NC} $1"
    PASS=$((PASS + 1))
}

fail() {
    echo -e "  ${RED}FAIL${NC} $1"
    FAIL=$((FAIL + 1))
}

skip() {
    echo -e "  ${YELLOW}SKIP${NC} $1"
    SKIP=$((SKIP + 1))
}

# ─── Test 1: Store Raw Trace ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 1: Store raw trace (PostgreSQL)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Call memory_add with a test trace"
echo ""
echo "  memory_add({"
echo "    group_id: '${GROUP_ID}',"
echo "    user_id: '${TEST_USER}',"
echo "    content: '${TEST_PREFIX} Test trace: smoke test raw event storage',"
echo "    metadata: { source: 'manual', agent_id: '${TEST_USER}' }"
echo "  })"
echo ""
echo "  Expected: Returns memory ID. Content stored in PostgreSQL."
echo "  Verify:   Search for the stored content in next test."
echo ""

# ─── Test 2: Search Memory ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 2: Search memory (hybrid search)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Search for the trace stored in Test 1"
echo ""
echo "  memory_search({"
echo "    query: '${TEST_PREFIX} smoke test',"
echo "    group_id: '${GROUP_ID}',"
echo "    limit: 5"
echo "  })"
echo ""
echo "  Expected: Returns at least 1 result matching the test trace."
echo "  Verify:   Result content includes '${TEST_PREFIX}'."
echo ""

# ─── Test 3: Duplicate Detection ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 3: Duplicate detection (search before write)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Before storing, search for existing memory"
echo ""
echo "  memory_search({"
echo "    query: '${TEST_PREFIX} Test trace',"
echo "    group_id: '${GROUP_ID}',"
echo "    limit: 5"
echo "  })"
echo ""
echo "  Expected: Finds the trace from Test 1."
echo "  Rule:     If a match exists, do NOT store a duplicate."
echo "  Verify:   Agent skips duplicate insert and reuses existing."
echo ""

# ─── Test 4: Request Promotion ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 4: Request promotion (HITL gate)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Request promotion of the test trace to insight"
echo ""
echo "  memory_promote({"
echo "    id: '<memory-id-from-test-1>',"
echo "    group_id: '${GROUP_ID}',"
echo "    rationale: 'Smoke test promotion. Validated: test framework executes correctly. Reusable: test pattern applies across projects. Confidence: 0.9.'"
echo "  })"
echo ""
echo "  Expected: Promotion request queued for curator approval."
echo "  Note:     Promotion does NOT happen immediately. HITL required."
echo "  Verify:   System confirms proposal created (not that the insight is active)."
echo ""

# ─── Test 5: Supersede Pattern ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 5: Supersede pattern (versioned update)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Search for existing insight, then supersede"
echo ""
echo "  Step 1: Search for existing"
echo "  MCP_DOCKER_search_memories({ query: 'smoke test decision' })"
echo ""
echo "  Step 2: Create new version (if existing found)"
echo "  MCP_DOCKER_create_entities({"
echo "    entities: [{"
echo "      name: '${TEST_PREFIX} Smoke Test Decision (v2)',"
echo "      type: 'Decision',"
echo "      observations: ["
echo "        'Supersedes v1 — updated with new evidence',"
echo "        'group_id: ${GROUP_ID}',"
echo "        'Validated: smoke test framework'"
echo "      ]"
echo "    }]"
echo "  })"
echo ""
echo "  Step 3: Link to old version"
echo "  MCP_DOCKER_create_relations({"
echo "    relations: [{"
echo "      source: '${TEST_PREFIX} Smoke Test Decision (v2)',"
echo "      target: '${TEST_PREFIX} Smoke Test Decision',"
echo "      relationType: 'SUPERSEDES'"
echo "    }]"
echo "  })"
echo ""
echo "  Step 4: Mark old as deprecated"
echo "  MCP_DOCKER_add_observations({"
echo "    entityName: '${TEST_PREFIX} Smoke Test Decision',"
echo "    observations: ['DEPRECATED: Superseded by v2 on ${TIMESTAMP}']"
echo "  })"
echo ""
echo "  Expected: New version linked. Old version marked deprecated."
echo "  Verify:   Search returns v2. v1 shows SUPERSEDES relationship."
echo ""

# ─── Test 6: Soft-Delete and Restore ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 6: Soft-delete and restore (30-day window)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Soft-delete a test memory, then restore it"
echo ""
echo "  Step 1: Soft-delete"
echo "  memory_delete({"
echo "    id: '<test-memory-id>',"
echo "    group_id: '${GROUP_ID}',"
echo "    user_id: '${TEST_USER}'"
echo "  })"
echo ""
echo "  Step 2: Verify it's in deleted list"
echo "  memory_list_deleted({ group_id: '${GROUP_ID}' })"
echo ""
echo "  Step 3: Restore it"
echo "  memory_restore({"
echo "    id: '<test-memory-id>',"
echo "    group_id: '${GROUP_ID}',"
echo "    user_id: '${TEST_USER}'"
echo "  })"
echo ""
echo "  Step 4: Verify it's restored"
echo "  memory_get({ id: '<test-memory-id>', group_id: '${GROUP_ID}' })"
echo ""
echo "  Expected: Memory soft-deleted → appears in deleted list → restored → accessible again."
echo "  Verify:   Final get returns the original content."
echo ""

# ─── Test 7: Semantic Graph Deduplication ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 7: Semantic graph deduplication (create + search before create)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Create entity, then attempt duplicate creation"
echo ""
echo "  Step 1: Create an entity"
echo "  MCP_DOCKER_create_entities({"
echo "    entities: [{"
echo "      name: '${TEST_PREFIX} Dedup Test Entity',"
echo "      type: 'Entity',"
echo "      observations: ['group_id: ${GROUP_ID}', 'Created for dedup testing']"
echo "    }]"
echo "  })"
echo ""
echo "  Step 2: Search before creating (dedup check)"
echo "  MCP_DOCKER_search_memories({ query: '${TEST_PREFIX} Dedup Test' })"
echo ""
echo "  Step 3: Rule — if search returns a match, do NOT create duplicate"
echo "  // SKIP the create_entities call if match found"
echo ""
echo "  Expected: Entity created once. Second attempt blocked by search-first rule."
echo "  Verify:   Only one entity with this name exists in the semantic graph."
echo ""

# ─── Test 8: Permission Check ───

echo "═══════════════════════════════════════════════════════════"
echo "TEST 8: Permission matrix (write access by agent)"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Verify these permissions are enforced:"
echo ""
echo "  | Agent    | PG Write | Graph Write | Promote |"
echo "  |----------|----------|-------------|---------|"
echo "  | Kotler   | YES      | SUPERSEDES  | YES     |"
echo "  | Aaker    | YES      | NO          | YES     |"
echo "  | Glaser   | YES      | NO          | YES     |"
echo "  | Rand     | YES      | NO          | YES     |"
echo "  | Ogilvy   | NO       | NO          | YES     |"
echo "  | Munari   | NO (RO)  | NO (RO)     | NO      |"
echo "  | Tufte    | NO       | NO          | YES     |"
echo "  | Scout    | NO (RO)  | NO (RO)     | NO      |"
echo ""
echo "  Expected: Agents respect their write boundaries."
echo "  Violations: Should be logged as events."
echo ""

# ─── Cleanup ───

echo "═══════════════════════════════════════════════════════════"
echo "CLEANUP: Remove test artifacts"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "  Agent action: Soft-delete all smoke test memories"
echo ""
echo "  memory_search({"
echo "    query: '${TEST_PREFIX}',"
echo "    group_id: '${GROUP_ID}',"
echo "    limit: 20"
echo "  })"
echo ""
echo "  For each result:"
echo "  memory_delete({ id: '<id>', group_id: '${GROUP_ID}', user_id: '${TEST_USER}' })"
echo ""
echo "  For semantic graph test entities:"
echo "  MCP_DOCKER_search_memories({ query: '${TEST_PREFIX}' })"
echo "  MCP_DOCKER_add_observations({"
echo "    entityName: '<entity-name>',"
echo "    observations: ['DEPRECATED: Smoke test artifact. Safe to remove.']"
echo "  })"
echo ""

# ─── Summary ───

echo "═══════════════════════════════════════════════════════════"
echo -e "Results: ${GREEN}${PASS} pass${NC}  ${RED}${FAIL} fail${NC}  ${YELLOW}${SKIP} skip${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "NOTE: This smoke test produces agent-actionable instructions."
echo "An agent with access to allura-brain_* and MCP_DOCKER_* tools"
echo "should execute each test step and verify the expected outcome."
echo ""

if [[ $FAIL -gt 0 ]]; then
    exit 2
else
    exit 0
fi