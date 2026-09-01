---
description: "Global quick prompt for instant goal definition. Transform any idea into structured goals, requirements, and success criteria in seconds."
argument-hint: "[your idea or task description]"
allowed-tools: ["read", "write"]
skill: quickprompt
global: true
---

# QuickPrompt Command

Transform vague ideas into actionable goals instantly.

## Usage

```bash
/quickprompt "your idea here"
```

## How It Works

1. **Analyze** your input
2. **Generate** structured goal definition
3. **Output** in scannable format
4. **Ready** to execute or delegate

## Output Format

```
🎯 GOAL: [clear objective]

📋 REQUIREMENTS:
1. [requirement]
2. [requirement]
3. [requirement]

✅ SUCCESS CRITERIA:
- [measurable]
- [measurable]
- [measurable]

🏁 DONE WHEN:
- [checkpoint]
- [checkpoint]
- [checkpoint]
```

## Examples

### Quick Start

```bash
/quickprompt "Build user auth"
```

**Output**:
```
🎯 GOAL: Implement secure user authentication system

📋 REQUIREMENTS:
1. Email/password login with secure hashing
2. Password reset via email
3. Session management with tokens
4. Rate limiting for security

✅ SUCCESS CRITERIA:
- 100% of logins use secure authentication
- Password reset completes in <60 seconds
- Zero plaintext password storage
- Session tokens expire properly

🏁 DONE WHEN:
- All auth flows tested and passing
- Security review complete
- API documentation updated
- Monitoring alerts configured
```

### Performance Task

```bash
/quickprompt "Make app faster"
```

**Output**:
```
🎯 GOAL: Reduce application load time to improve UX

📋 REQUIREMENTS:
1. Establish performance baseline
2. Identify 3 slowest operations
3. Implement optimizations
4. Validate improvements

✅ SUCCESS CRITERIA:
- 95% of loads under 2 seconds
- Time-to-Interactive reduced 40%
- No error rate increase
- Lighthouse score ≥ 90

🏁 DONE WHEN:
- Changes deployed to staging
- Load testing confirms targets
- 7-day monitoring shows improvement
- Team review signed off
```

## Tips

- **Be specific**: "Add payment" → "Add Stripe payment with webhooks"
- **Include context**: "For mobile users" or "for admins"
- **One goal at a time**: Break big projects into smaller prompts
- **Iterate**: Run again if output needs refinement

## Next Steps

After `/quickprompt`:
1. Review output - does it match your intent?
2. Copy/paste into project docs
3. Delegate to appropriate agent
4. Log to memory system
5. Begin execution

## Integration

- **→ MemoryOrchestrator**: Delegate goal to primary agent
- **→ MemoryCurator**: Break into subtasks
- **→ MemoryArchitect**: Create technical implementation plan
- **→ MemoryTester**: Define test scenarios

## When to Use

✅ Starting new features
✅ Planning sprints
✅ Defining project scope
✅ Clarifying vague requests
✅ Breaking down epics
✅ Setting OKRs

## When NOT to Use

❌ Debugging (use `/debug` instead)
❌ Code review (use `/review` instead)
❌ Already have detailed spec

---

**Speed**: Results in <5 seconds
**Format**: Terminal-optimized, copy-ready
**Goal**: Remove friction from getting started