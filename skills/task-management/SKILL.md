---
name: task-management
description: "Task tracking and dependency resolution with atomic breakdowns. Trigger when managing task progress, finding next eligible tasks, identifying blocked work, or validating task integrity. Use when agent needs CLI-based task management."
globs: ["**"]
---

# Task Management Skill

> **Purpose**: Track, manage, and validate feature implementations with atomic task breakdowns, dependency resolution, and progress monitoring.

---

## What I Do

I provide a command-line interface for managing task breakdowns created by the TaskManager subagent. I help you:

- **Track progress** - See status of all features and their subtasks
- **Find next tasks** - Show eligible tasks (dependencies satisfied)
- **Identify blocked tasks** - See what's blocked and why
- **Manage completion** - Mark subtasks as complete with summaries
- **Validate integrity** - Check JSON files and dependency trees

---

## How to Use Me

### Quick Start

```bash
# Show all task statuses
bash .claude/skills/task-management/router.sh status

# Show next eligible tasks
bash .claude/skills/task-management/router.sh next

# Show blocked tasks
bash .claude/skills/task-management/router.sh blocked

# Mark a task complete
bash .claude/skills/task-management/router.sh complete <feature> <seq> "summary"

# Validate all tasks
bash .claude/skills/task-management/router.sh validate
```

### Command Reference

| Command | Description |
|---------|-------------|
| `status [feature]` | Show task status summary for all features or specific one |
| `next [feature]` | Show next eligible tasks (dependencies satisfied) |
| `parallel [feature]` | Show parallelizable tasks ready to run |
| `deps <feature> <seq>` | Show dependency tree for a specific subtask |
| `blocked [feature]` | Show blocked tasks and why |
| `complete <feature> <seq> "summary"` | Mark subtask complete with summary |
| `validate [feature]` | Validate JSON files and dependencies |
| `help` | Show help message |

---

## Architecture

```
.claude/skills/task-management/
├── SKILL.md                          # This file
├── router.sh                         # CLI router (entry point)
└── scripts/
    └── task-cli.ts                   # Task management CLI implementation
```

---

## Task File Structure

Tasks are stored in `.tmp/tasks/` at the project root:

```
.tmp/tasks/
├── {feature-slug}/
│   ├── task.json                     # Feature-level metadata
│   ├── subtask_01.json               # Subtask definitions
│   ├── subtask_02.json
│   └── ...
└── completed/
    └── {feature-slug}/               # Completed tasks
```

---

## Key Concepts

### 1. Dependency Resolution
Subtasks can depend on other subtasks. A task is "ready" only when all its dependencies are complete.

### 2. Parallel Execution
Set `parallel: true` to indicate a subtask can run alongside other parallel tasks with satisfied dependencies.

### 3. Status Tracking
- **pending** - Not started, waiting for dependencies
- **in_progress** - Currently being worked on
- **completed** - Finished with summary
- **blocked** - Explicitly blocked (not waiting for deps)

### 4. Exit Criteria
Each feature has exit_criteria that must be met before marking the feature complete.

### 5. Validation Rules
- All subtask IDs start with feature name
- Sequence numbers are unique and properly formatted
- All dependencies reference existing subtasks
- No circular dependency chains
- Each subtask has acceptance criteria and deliverables

---

## Integration with TaskManager

The TaskManager subagent creates task files using this format. When you delegate to TaskManager:

```javascript
task(
  subagent_type="TaskManager",
  description="Implement feature X",
  prompt="Break down this feature into atomic subtasks..."
)
```

TaskManager creates:
1. `.tmp/tasks/{feature}/task.json` - Feature metadata
2. `.tmp/tasks/{feature}/subtask_XX.json` - Individual subtasks

You can then use this skill to track and manage progress.