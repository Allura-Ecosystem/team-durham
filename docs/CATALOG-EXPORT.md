# Catalog Export

The standalone repository is authoritative. The Team Durham directory in `allura-plugins` is a generated consumer package pinned to an exact standalone commit.

## Contract

- `SOURCE.json` identifies the canonical repository and role model.
- `export-manifest.json` lists the only paths eligible for distribution.
- `scripts/export_catalog.py` creates the package.
- Generated `SOURCE.json` records `revision` and `sourceDirty`.
- Generated `EXPORT.json` records every exported file's SHA-256 hash.

`clients/`, `.opencode/`, `opencode.jsonc`, `AGENTS.md`, `PROGRESS.md`, and other workspace-only material are not exported.

## Generate

Run from a clean checkout at the SHA that the consumer will pin:

```bash
python3 scripts/export_catalog.py --output /tmp/team-durham
```

The command refuses an existing non-empty output directory unless `--force` is supplied.

## Validate without keeping output

```bash
python3 scripts/export_catalog.py --check
```

This builds a temporary export, validates provenance and hashes, then removes it.

## Consumer integration sequence

1. Merge and push the standalone change.
2. Record the exact standalone commit SHA.
3. Check out that SHA with a clean tree.
4. Export to a temporary directory.
5. Replace only the catalog's generated Team Durham package in the catalog repository.
6. Verify the generated `SOURCE.json.revision` equals the pinned SHA.
7. Run both repositories' validation and secret scans.
8. Commit the catalog change separately and record both SHAs.

Do not copy changes from the catalog back into canonical source. Recreate them here and regenerate.
