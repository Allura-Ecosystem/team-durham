# Changelog

All notable changes to the Team Durham harness will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.1] - 2026-07-16

### Added
- Added `.claude-plugin/plugin.json` manifest — Team Durham now loads in Claude Code (was Codex-only)
- Created `brand-loop` skill following loopy's feedback-cycle contract (observe/choose/act/verify/record/stop) using Durham agents: Aaker (strategy), Kotler (positioning), Glaser (visual), Ogilvy (copy), Munari (QA), Rubin (taste gate)
- Added `/brand-auto` command — bounded autonomous brand execution with specialist routing, Munari/Rubin verification gates, and Brain writeback
- HITL taste gate preserved: brand-auto does not ship brand without explicit approval
- Uses `group_id: "allura-team-durham"` on all Brain operations

### Changed
- Registered `brand-auto.md` in the new Claude manifest commands array (9 commands)

### Fixed
- Claude Desktop loading failure: Team Durham had no `.claude-plugin/` manifest, so it only loaded in Codex. Now loads in both runtimes.