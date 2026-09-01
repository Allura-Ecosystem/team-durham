# Documentation Standards

This harness uses structured documentation as a first-class engineering artifact.
See `guidelines/AI-GUIDELINES.md` for the full standard.

## Required Artifacts

| Artifact | File | Purpose |
|----------|------|---------|
| Blueprint | `BLUEPRINT.md` | Single source of design intent |
| Solution Architecture | `SOLUTION-ARCHITECTURE.md` | Topological view — who calls what |
| Design documents | `DESIGN-<AREA>.md` | Deep-dive on one functional area each |
| Requirements Matrix | `REQUIREMENTS-MATRIX.md` | B→F→Use Case traceability |
| Risks & Decisions | `RISKS-AND-DECISIONS.md` | Architectural decisions + risk register |
| Data Dictionary | `DATA-DICTIONARY.md` | Canonical field-level reference |

## Key Principles

1. **Blueprint first** — It must exist before any Design documents
2. **AI disclosure** — AI-drafted content gets a notice block
3. **Cross-reference everything** — Every document links to related documents
4. **Source of truth** — Schema > Code > Docs
5. **Same-PR updates** — Schema or API changes must update Data Dict and Req Matrix in the same PR

## Agent Responsibilities

- **Kotler (Orchestrator)**: Ensures Blueprint exists before design work
- **Aaker (Strategist)**: Cross-references positioning decisions in Risks & Decisions
- **Rand (Kit Builder)**: Follows naming conventions, includes cross-references
- **Munari (QA)**: Validates completeness checklist before approving deliverables
- **Scout**: Flags stale docs (>90 days old with active code changes)