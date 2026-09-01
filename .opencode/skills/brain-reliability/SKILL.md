---
name: brain-reliability
description: Bootstrap, verify, recover, and keep Allura Brain reliable across computer boot and session start. Use when the machine has just restarted, Brain tools are not connected, Docker services may be down, or MCP/gateway health needs deterministic verification.
---

# Brain Reliability Skill

Use this skill when Allura Brain must be available reliably, especially after reboot.

## What this skill owns

- Start the Allura stack deterministically
- Verify MCP and HTTP gateway readiness
- Recover the Brain path when containers are up but tools are not healthy
- Install a user boot service so the stack comes up when the computer starts

## Quick start

```bash
# Show current Brain status
bash .opencode/skills/brain-reliability/router.sh status

# Start the stack and wait for readiness
bash .opencode/skills/brain-reliability/router.sh up

# Recover MCP/gateway when Brain is unavailable
bash .opencode/skills/brain-reliability/router.sh recover

# Install user boot service
bash .opencode/skills/brain-reliability/router.sh install-user-service
```

## Workflow

1. Check Docker daemon reachability
2. Check expected containers and health states
3. Check HTTP gateway readiness at `/ready`
4. If unhealthy, run the smallest recovery step that restores service
5. If asked for boot automation, install the user systemd service

## Invariants

- Use the root `docker-compose.yml` as the canonical stack file
- Prefer readiness truth over container liveness
- Do not claim Brain is ready unless MCP container, HTTP gateway, and `/ready` all pass
- Keep boot automation reversible and repo-local where possible

## Commands

| Command | Purpose |
|---|---|
| `status` | Show service/container health and readiness |
| `up` | Start stack and wait for readiness |
| `recover` | Recover MCP/gateway after reboot or partial failure |
| `restart` | Restart main services and wait |
| `logs` | Show recent MCP/gateway logs |
| `install-user-service` | Install and enable boot-time user service |

## Boot behavior

The installer sets up a **user systemd service**. For true computer-boot startup before login, enable user lingering:

```bash
sudo loginctl enable-linger "$USER"
```

Without lingering, the service still starts automatically when you log in.

## When not to use this skill

- Do not use it for application debugging unrelated to Brain/MCP availability
- Do not use it to mutate database contents
- Do not assume it fixes app-level logic bugs; it only restores stack availability

## Troubleshooting

| Symptom | Likely check |
|---|---|
| `allura-brain_*` says Not connected | Run `status`, then `recover` |
| MCP container says healthy but Brain still unavailable | Check gateway `/ready` and MCP logs |
| Service does not start on reboot | Confirm `systemctl --user` service is enabled and lingering is on |
| Docker services never become ready | Inspect `docker compose logs` for postgres/neo4j/mcp/http-gateway |
