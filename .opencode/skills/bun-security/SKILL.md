---
description: Bun security skill. Use when detecting npm vulnerabilities, postinstall hooks, or CanisterWorm indicators. Enforces Bun-only policy.
mode: subagent
temperature: 0.1
permissions:
  read: allow
  edit: ask
  bash:
    "bun *": allow
    "grep *": allow
    "ls -la *": allow
    "cat *": allow
    "npm*": deny
    "npx*": deny
    "*": ask
---

# Bun Security Skill

Enforce Bun-only security policy and detect CanisterWorm/npm vulnerabilities.

## Policy

- ✅ **Bun only**: `bun install`, `bun run`, `bun tsx`
- ❌ **NPM banned**: No `npm install`, `npx`, `npm run`
- ❌ **No postinstall hooks**: Block all postinstall scripts
- 🔒 **Lockfile required**: `bun.lockb` must be committed

## CanisterWorm Detection

Check for these indicators:

```bash
# Malware artifacts
ls ~/.local/share/pgmon/service.py 2>/dev/null && echo "🚨 MALWARE FOUND"
ls ~/.config/systemd/user/pgmon.service 2>/dev/null && echo "🚨 MALWARE FOUND"
ls /tmp/pglog 2>/dev/null && echo "🚨 PAYLOAD DOWNLOADED"

# C2 connections
netstat -an | grep "icp0.io"

# Postinstall hooks
grep -r "postinstall" package.json
grep -r "postinstall" node_modules/*/package.json
```

## Audit Commands

```bash
# Check for npm usage
git log --all --grep="npm" --oneline
grep -r "npm install" . --include="*.md" --include="*.yml" --include="*.yaml"

# Verify Bun lockfile
ls -la bun.lockb
git ls-files | grep bun.lockb

# Audit dependencies
bun audit
bun pm ls
```

## Security Checklist

- [ ] No `npm` or `npx` in codebase
- [ ] `bun.lockb` committed
- [ ] No postinstall scripts in dependencies
- [ ] No malware artifacts present
- [ ] No suspicious network connections

## Response to Security Issues

If npm detected:
1. Replace with Bun equivalent
2. Update documentation
3. Add CI check to block npm

If malware detected:
1. ISOLATE: Disconnect network
2. PRESERVE: Backup artifacts
3. ROTATE: All secrets immediately
4. CLEAN: Remove malware files
5. VERIFY: System clean
