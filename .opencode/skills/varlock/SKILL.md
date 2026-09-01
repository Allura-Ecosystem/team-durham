---
name: varlock
description: Secure environment variable management with Varlock. Use when handling secrets, API keys, credentials, or any sensitive configuration. Ensures secrets are never exposed in terminals, logs, traces, or context. Trigger phrases include "environment variables", "secrets", ".env", "API key", "credentials", "sensitive", "Varlock".
version: 1.0.0
author: wrsmith108
type: skill
category: review
tags:
  - security
  - secrets
  - environment-variables
  - credentials
  - varlock
---

# Varlock Security Skill

Secure-by-default environment variable management.

> **Repository:** https://github.com/wrsmith108/varlock-claude-skill
> **Wraps:** https://varlock.dev by DMNO

## Core Principle: Secrets Never Exposed

When working with agents, secrets must NEVER appear in:
- Terminal output
- Context input/output
- Log files or traces
- Git commits or diffs
- Error messages

This skill ensures all sensitive data is properly protected.

---

## Prerequisites

Install the Varlock CLI:

```bash
curl -sSfL https://varlock.dev/install.sh | sh -s -- --force-no-brew
export PATH="$HOME/.varlock/bin:$PATH"
```

---

## Command Reference

| Action | Command |
|--------|---------|
| Validate all secrets | `varlock load` |
| Quiet validation | `varlock load --quiet` |
| Run with env injected | `varlock run -- <command>` |
| View schema (safe) | `cat .env.schema` |
| Check specific var | `varlock load \| grep VAR_NAME` |

---

## Forbidden Patterns

| Never Do | Why |
|----------|-----|
| `cat .env` | Exposes all secrets |
| `echo $SECRET` | Exposes to context |
| `printenv \| grep` | Exposes matching secrets |
| Read .env with tools | Secrets in context |
| Hardcode in commands | In shell history |

---

## Schema File

Create `.env.schema` to define variable types and sensitivity:

```bash
# Global defaults
# @defaultSensitive=true @defaultRequired=infer

# Public config
# @type=enum(development,staging,production) @sensitive=false
NODE_ENV=development

# Sensitive secrets
# @type=string(startsWith=sk_) @required @sensitive
STRIPE_SECRET_KEY=

# @type=url @required @sensitive
DATABASE_URL=
```

### Annotations

| Annotation | Effect |
|------------|--------|
| `@sensitive` | Value masked in all output |
| `@sensitive=false` | Value shown (for public keys) |
| `@required` | Must be present |
| `@type=string(startsWith=X)` | Prefix validation |

---

## Handling Secret-Related Tasks

### When User Asks to "Check if API key is set"

```bash
# Safe approach
varlock load 2>&1 | grep "API_KEY"
# Shows: API_KEY - sensitive - [masked]

# NEVER do
echo $API_KEY
```

### When User Asks to "Debug authentication"

```bash
# Safe approach - check presence and format
varlock load  # Validates types and required fields

# Check if key has correct prefix (without showing value)
varlock load 2>&1 | grep -E "(CLERK|AUTH)"

# NEVER do
printenv | grep KEY
```

### When User Asks to "Show me .env"

```bash
# Safe - show schema, not values
cat .env.schema

# NEVER show actual .env
```

### When User Asks to "Update a secret"

**Decline.** Ask the user to update manually. Never write secrets to files through agent context.

---

## Docker Integration

```dockerfile
# Install Varlock in container
RUN curl -sSfL https://varlock.dev/install.sh | sh -s -- --force-no-brew \
    && ln -s /root/.varlock/bin/varlock /usr/local/bin/varlock

# Validate at container start
CMD ["varlock", "run", "--", "npm", "start"]
```

---

## Never Do This

- Display or log secret values
- Read .env files directly with tools
- Hardcode secrets in commands or code
- Commit secrets to version control
- Bypass Varlock for "quick debugging"

## Always Do This

- Use `varlock load` to validate secrets (shows masked values)
- Use `cat .env.schema` to inspect variable definitions
- Use `varlock run -- <command>` to inject secrets at runtime
- Mark all sensitive variables with `@sensitive` in .env.schema
- Fail closed: if validation fails, stop and report