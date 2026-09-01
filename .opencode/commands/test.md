---
description: Run the complete testing pipeline
argument-hint: "[test file or pattern]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
  - Agent
  - Skill
  - Task
---

# Testing Pipeline

This command runs the complete testing pipeline for the project.

## Usage

To run the complete testing pipeline, just type:

1. Run bun run typecheck
2. Run bun run lint
3. Run bun test
4. Report any failures
5. Fix any failures
6. Repeat until all tests pass
7. Report success

## What This Command Does

1. Runs `bun run typecheck` to check for type errors
2. Runs `bun run lint` to check for linting errors
3. Runs `bun test` to run the tests
4. Reports any failures