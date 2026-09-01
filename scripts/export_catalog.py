#!/usr/bin/env python3
"""Create and validate a deterministic Team Durham catalog export."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload) -> None:
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def git(*args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(ROOT), *args],
        check=True,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return result.stdout.strip()


def source_revision() -> tuple[str, bool]:
    revision = git("rev-parse", "HEAD")
    dirty = bool(git("status", "--porcelain", "--untracked-files=all"))
    return revision, dirty


def ensure_safe_tree(source: Path) -> None:
    root = ROOT.resolve()
    paths = [source]
    if source.is_dir():
        paths.extend(source.rglob("*"))
    for path in paths:
        if path.is_symlink():
            try:
                path.resolve(strict=True).relative_to(root)
            except (ValueError, FileNotFoundError) as exc:
                raise RuntimeError(f"export symlink escapes repository or is broken: {path.relative_to(ROOT)}") from exc


def copy_entry(relative: str, output: Path) -> None:
    source = ROOT / relative
    ensure_safe_tree(source)
    target = output / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if source.is_dir():
        shutil.copytree(source, target, symlinks=True)
    else:
        shutil.copy2(source, target)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def inventory(output: Path) -> list[dict[str, object]]:
    rows = []
    for path in sorted(p for p in output.rglob("*") if p.is_file() and p.name != "EXPORT.json"):
        rows.append(
            {
                "path": str(path.relative_to(output)),
                "sha256": sha256(path),
                "size": path.stat().st_size,
            }
        )
    return rows


def verify_export(output: Path, manifest: dict, revision: str) -> None:
    source = read_json(output / "SOURCE.json")
    if source.get("revision") != revision:
        raise RuntimeError("exported SOURCE.json does not contain the source revision")
    receipt = read_json(output / "EXPORT.json")
    if receipt.get("sourceRevision") != revision:
        raise RuntimeError("EXPORT.json source revision mismatch")
    expected = receipt.get("files", [])
    actual = inventory(output)
    if expected != actual:
        raise RuntimeError("EXPORT.json hash inventory does not match exported files")
    for excluded in manifest.get("excludedWorkspaceRoots", []):
        if (output / excluded).exists():
            raise RuntimeError(f"workspace-only path leaked into export: {excluded}")
    if not actual:
        raise RuntimeError("export is empty")


def build(output: Path, force: bool = False) -> tuple[str, int]:
    manifest = read_json(ROOT / "export-manifest.json")
    revision, dirty = source_revision()
    if output.exists() and any(output.iterdir()):
        if not force:
            raise RuntimeError(f"output is not empty: {output} (use --force)")
        shutil.rmtree(output)
    output.mkdir(parents=True, exist_ok=True)

    for relative in manifest["include"]:
        copy_entry(relative, output)

    source = read_json(output / "SOURCE.json")
    source["revision"] = revision
    source["sourceDirty"] = dirty
    write_json(output / "SOURCE.json", source)

    receipt = {
        "schemaVersion": 1,
        "package": manifest["package"],
        "sourceRepository": source["canonicalRepository"],
        "sourceRevision": revision,
        "sourceDirty": dirty,
        "files": inventory(output),
    }
    write_json(output / "EXPORT.json", receipt)
    verify_export(output, manifest, revision)
    return revision, len(receipt["files"])


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, help="directory to create")
    parser.add_argument("--check", action="store_true", help="build and validate in a temporary directory")
    parser.add_argument("--force", action="store_true", help="replace a non-empty output directory")
    args = parser.parse_args()
    if not args.check and args.output is None:
        parser.error("provide --output or --check")
    if args.check and args.output is not None:
        parser.error("--check and --output are mutually exclusive")
    return args


def main() -> int:
    args = parse_args()
    try:
        if args.check:
            with tempfile.TemporaryDirectory(prefix="team-durham-export-") as directory:
                revision, count = build(Path(directory))
        else:
            revision, count = build(args.output.resolve(), force=args.force)
    except (OSError, RuntimeError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print(f"Validated catalog export at {revision} with {count} files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
