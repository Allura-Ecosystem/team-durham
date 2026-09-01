# Documentation Impact Matrix

> Use this checklist before any code change to determine whether canonical docs need updating.

## Canonical Docs and Their Impact Signals

| Canonical Doc | File | Impact Signals |
|---------------|------|----------------|
| Blueprint | `docs/allura/BLUEPRINT.md` | New/changed business requirements, core concepts, API surface, data model, execution rules |
| Solution Architecture | `docs/allura/SOLUTION-ARCHITECTURE.md` | New/changed actors, interfaces, topologies, external systems, deployment changes |
| Design | `docs/allura/DESIGN-ALLURA.md` | New/changed API contracts, state machines, business rules, use cases, constraints |
| Requirements Matrix | `docs/allura/REQUIREMENTS-MATRIX.md` | New/changed B# or F# traceability, use case labels |
| Risks & Decisions | `docs/allura/RISKS-AND-DECISIONS.md` | New architectural decisions, risks, status changes |
| Data Dictionary | `docs/allura/DATA-DICTIONARY.md` | New/changed fields, entities, enums, relationships, events |

## Impact Assessment Protocol

### Step 1: Identify Changed Files

List every file that will be modified in the PR.

### Step 2: Map to Canonical Docs

For each changed file, check:

| Change Type | Likely Doc Impact |
|-------------|-------------------|
| New API endpoint | DESIGN-ALLURA.md, REQUIREMENTS-MATRIX.md |
| Changed API contract | DESIGN-ALLURA.md, DATA-DICTIONARY.md |
| New database field/table | DATA-DICTIONARY.md, BLUEPRINT.md |
| New business rule | BLUEPRINT.md, DESIGN-ALLURA.md, RISKS-AND-DECISIONS.md |
| New external integration | SOLUTION-ARCHITECTURE.md, RISKS-AND-DECISIONS.md |
| New state machine | DESIGN-ALLURA.md |
| New event type | BLUEPRINT.md, DATA-DICTIONARY.md |
| Security/auth change | RISKS-AND-DECISIONS.md, SOLUTION-ARCHITECTURE.md |
| Performance optimization | RISKS-AND-DECISIONS.md |
| Bug fix (no behavior change) | None (usually) |
| Refactor (no behavior change) | None (usually) |

### Step 3: Plan Doc Updates

For each impacted doc, note:
- Which section needs updating
- What the change is
- Who reviews (Brooks for architecture, Knuth for data, Pike for interface)

### Step 4: Update in Same PR

All canonical doc updates must be in the same PR as the code change. No exceptions.

## Quick Reference: No-Impact Changes

The following changes typically do NOT require canonical doc updates:

- Bug fixes that restore intended behavior
- Refactors that preserve external contracts
- Test additions or improvements
- Dependency version bumps
- Comment/documentation typo fixes
- Build/CI configuration changes
- Logging or observability additions (unless they change the audit surface)

## Quick Reference: Always-Impact Changes

The following changes ALWAYS require canonical doc review:

- New API endpoints or changed contracts
- New database fields, tables, or enums
- New business rules or changed execution semantics
- New external integrations or changed topologies
- Security boundary changes
- New event types or changed event schemas