# Workspace Boundary Repair Progress

## Task

Reorganize `/media/ronin704/Games/Projects/Allura-ecosystem` around the
canonical Allura product boundary.

## Constraints

- Preserve every repository, uncommitted change, and user-created artifact.
- Do not reset, clean, stash, delete, or overwrite project data.
- Keep `Allura-ecosystem/allura-memory` at its current submodule path.
- Restore Team Durham's Brandmaker to its tracked parent-repository path.
- Treat Allura Brain write failures as degraded state, not successful logging.

## Definition of Done

- [x] Product folder contains only canonical product and organization entries.
- [x] Harnesses, client work, experiments, archives, and runtime output are separated.
- [x] Repository HEAD, origin, and dirty state are verified after moves.
- [x] Parent repository no longer shows Brandmaker as deleted.
- [x] Real environment files are owner-readable/writable only.
- [x] Notion work item contains final evidence and status.

## Progress

- [x] Phase 1: Inventory repositories, Git boundaries, dirty state, and source documents.
- [x] Phase 2: Record the boundary decision and acceptance criteria.
- [x] Phase 3: Create destinations and move non-product entries.
- [x] Phase 4: Update workspace documentation and stale path references.
- [x] Phase 5: Verify filesystem, Git, permissions, and board evidence.

## Verification Checklist

- [x] `find Allura-ecosystem -maxdepth 1` matches the approved product boundary.
- [x] `git -C Projects status` no longer reports Brandmaker deletions.
- [x] Every moved Git repository passes `git rev-parse --show-toplevel`.
- [x] Repository remotes and HEAD values match the pre-move inventory.
- [x] Allura submodule status and dirty changes are preserved.
- [x] No known real `.env` or `.env.local` file is group/world accessible.

## Notes

- Allura Brain retrieval succeeded from Neo4j, but `memory_add` failed because
  PostgreSQL was unavailable.
- Notion work item:
  `https://app.notion.com/p/37c1d9be65b381f688cac704b41496cd`
- Git connectivity checks passed for the GitHub profile, Allura Memory,
  plugins, Team RAM, the client repository, and both experiment repositories.
- Parent and client linked worktrees were repaired with `git worktree repair`.
- A compatibility symlink recreated during verification was moved into
  `Workspace-Runtime/allura-ecosystem/legacy-links/`.
- Technical work is complete. Governance closure remains in review until the
  PostgreSQL-backed Allura trace succeeds.
