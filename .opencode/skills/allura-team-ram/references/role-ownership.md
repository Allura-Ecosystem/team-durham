# Team RAM Role Ownership

> Maps Team RAM roles to their domains, required skills, and review authority.

## Role Assignment

| Role | Agent | Domain | Required Skills | Review Authority |
|------|-------|--------|-----------------|-----------------|
| Architect | Brooks | Architecture, contracts, boundaries, route approval | `allura-team-ram`, `allura-architecture`, `party-mode`, `skill-creator` | Architecture decisions, interface contracts |
| Intent Gate | Jobs | Scope, acceptance criteria, product direction | `allura-team-ram`, `allura-product-intake` | Scope control, feature acceptance |
| Builder | Woz | Implementation, shipping working code | `allura-team-ram`, `allura-dev-story`, `frontend-craft`, `shadcn` | Code correctness, test coverage |
| Interface Review | Pike | Simplicity, API surface, interface design | `allura-team-ram`, `allura-code-review` | Interface simplicity, API contracts |
| Refactor Review | Fowler | Maintainability, incremental change, token efficiency | `allura-team-ram`, `allura-code-review` | Code maintainability, refactoring safety |
| Diagnostics | Bellard | Performance, measurement, low-level fixes | `allura-team-ram` | Performance benchmarks, diagnostics |
| Performance | Carmack | Optimization, API design, latency | `allura-team-ram` | Performance optimization |
| Data Architect | Knuth | Schema design, query optimization | `allura-team-ram` | Schema correctness, data integrity |
| DevOps | Hightower | CI/CD, deployment, observability | `allura-team-ram`, `mcp-docker`, `varlock` | Deployment, infrastructure |
| Discovery | Scout | Recon, pattern discovery, Brain search | `allura-team-ram`, `allura-memory-skill`, `multi-search` | Context discovery, pattern identification |

## Review Gates

### Code Review (allura-code-review)

| Reviewer | Focus Area |
|----------|-----------|
| Pike | Interface simplicity, API surface, source-of-truth clarity |
| Fowler | Maintainability, token use, component boundaries |

### Architecture Review (allura-architecture)

| Reviewer | Focus Area |
|----------|-----------|
| Brooks | Conceptual integrity, contract boundaries, route approval |

### Product Review (allura-product-intake)

| Reviewer | Focus Area |
|----------|-----------|
| Jobs | Acceptance criteria, scope control, feature completeness |

## Routing Rules

1. **Scout before build** — always hydrate context before implementation
2. **Skills before Ralph** — load required skills before validation
3. **Allura skills for Allura work** — use `allura-*` skills for Allura repo work
4. **Validate before done** — no story marked Done without validation evidence
5. **Brain remembers** — log all significant outcomes to Allura Brain