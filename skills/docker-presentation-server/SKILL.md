---
name: docker-presentation-server
description: >
  Deploy brand presentation HTML pages via Docker nginx, serve them for client review,
  and generate desktop screenshots using headless Chrome. Use when (1) user asks to
  'deploy presentation', 'serve brand pages', 'start presentation server', (2) brand
  presentation HTML files exist and need to be viewable in a browser, (3) user asks for
  'screenshots' of brand presentation pages, (4) any agent needs to capture visual
  snapshots of HTML presentation artifacts, (5) user mentions 'docker nginx' in context
  of serving presentation files. Handles container lifecycle, nginx config, container
  IP discovery (required for MCP Playwright inside Docker), and reliable host-side
  screenshot generation via google-chrome --headless.
---

# Docker Presentation Server

> **Executor:** Any Team Durham agent
> **Type:** Infrastructure + Screenshot capture
> **Prerequisite:** Built presentation HTML pages (from `brand-presentation-builder` skill)
> **group_id:** `allura-team-durham`

---

## Purpose

Brand presentations must be viewable in a real browser for two reasons: (1) clients interact with them via URL, and (2) automated screenshots require a served URL. Docker nginx:alpine provides a lightweight, disposable web server that serves static HTML with zero config. Screen captures are the primary deliverable — they become the visual record of what the client saw and get published to Notion.

---

## Container Deployment

### Step 1: Verify Prerequisites

```bash
# Confirm presentation artifacts directory exists
ls clients/{client-slug}/presentation-artifacts/*.html
# Confirm screenshots directory exists (create if missing)
mkdir -p clients/{client-slug}/presentation-artifacts/screenshots
```

### Step 2: Launch nginx Container

```bash
docker run -d \
  --name {client-slug}-brand-presentation \
  -p 8080:80 \
  -v "$(pwd)/clients/{client-slug}/presentation-artifacts:/usr/share/nginx/html:ro" \
  -v "$(pwd)/clients/{client-slug}/presentation-artifacts/screenshots:/usr/share/nginx/html/screenshots" \
  nginx:alpine
```

**Why these volume mounts:**
- `presentation-artifacts/` → `/usr/share/nginx/html` (read-only): Serves all HTML, SVGs
- `screenshots/` → writable mount: Allows MCP Playwright screenshot saves (if used)
- Port 8080: Standard presentation port, change if occupied (`docker ps` first)

**If port 8080 is occupied:**
```bash
# Find open port
ss -tlnp | grep -E '808[0-9]'
# Or use alternate port
docker run -d --name {client-slug}-brand-presentation -p 8081:80 ...
```

### Step 3: Verify Server Is Running

```bash
# Check container is up
docker ps | grep presentation

# Test with curl
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/brand-overview.html
# Expected: 200
```

### Step 4: Discover Container IP (for MCP Playwright)

MCP Playwright runs inside the Docker network and cannot resolve `localhost:8080`. The container IP is required.

```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' {client-slug}-brand-presentation
# Example output: 172.17.0.2
```

**Use this IP** when navigating MCP Playwright: `http://172.17.0.2/brand-overview.html`

---

## Screenshot Generation

### Recommended Method: Headless Google Chrome

**Why Chrome over MCP Playwright:** MCP Playwright saves files inside the container overlay filesystem — there is no reliable way to extract them to the host. Headless Chrome runs on the host and writes directly to the host filesystem.

```bash
google-chrome \
  --headless=new \
  --disable-gpu \
  --screenshot="clients/{client-slug}/presentation-artifacts/screenshots/01-brand-overview.png" \
  --window-size=1440,900 \
  http://localhost:8080/brand-overview.html
```

### Screenshot Sequence

Generate one screenshot per presentation page. Use consistent naming:

| File | Page | URL |
|------|------|-----|
| `01-brand-overview.png` | Brand Overview | `/brand-overview.html` |
| `02-logo-chooser.png` | Logo Chooser | `/logo-chooser.html` |
| `03-color-system.png` | Color System | `/color-system.html` |
| `04-typography.png` | Typography | `/typography.html` |
| `05-applications.png` | Applications | `/applications.html` |

### Full Screenshot Script

```bash
CLIENT_SLUG="{client-slug}"
SCREENSHOT_DIR="clients/${CLIENT_SLUG}/presentation-artifacts/screenshots"
BASE_URL="http://localhost:8080"

PAGES=(
  "brand-overview.html:01-brand-overview.png"
  "logo-chooser.html:02-logo-chooser.png"
  "color-system.html:03-color-system.png"
  "typography.html:04-typography.png"
  "applications.html:05-applications.png"
)

for PAGE in "${PAGES[@]}"; do
  IFS=":" read -r HTML FILENAME <<< "$PAGE"
  google-chrome \
    --headless=new \
    --disable-gpu \
    --screenshot="${SCREENSHOT_DIR}/${FILENAME}" \
    --window-size=1440,900 \
    "${BASE_URL}/${HTML}"
  echo "Captured: ${FILENAME}"
done
```

### Alternative: MCP Playwright (when Chrome unavailable)

If `google-chrome` is not installed, MCP Playwright can navigate and screenshot, but files will be saved inside the container:

```javascript
// Via MCP_DOCKER_browser_navigate
browser_navigate({ url: "http://172.17.0.2/brand-overview.html" })
// Then screenshot
browser_take_screenshot({ type: "png", filename: "screenshots/01-brand-overview.png" })
```

**Caveat:** These screenshots land in the container's writable overlay, not on the host. Use `docker cp` to extract:

```bash
docker cp {client-slug}-brand-presentation:/usr/share/nginx/html/screenshots/ \
  clients/{client-slug}/presentation-artifacts/screenshots/
```

### Alternative: npx Playwright (if installed)

```bash
npx playwright screenshot --viewport-size="1440,900" \
  http://localhost:8080/brand-overview.html \
  clients/{client-slug}/presentation-artifacts/screenshots/01-brand-overview.png
```

**Prerequisite:** `npx playwright install` must have been run to download browser binaries.

---

## Container Management

### Check Running Presentation Servers

```bash
docker ps --filter "name=presentation" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Stop a Presentation Server

```bash
docker stop {client-slug}-brand-presentation
docker rm {client-slug}-brand-presentation
```

### Restart (if HTML files were updated)

```bash
docker restart {client-slug}-brand-presentation
```

---

## Screenshot Quality Verification

After generating screenshots, verify:

1. **File size > 0** — Empty files mean the page didn't render
2. **File size > 50KB** — Screenshots under 50KB are likely blank or error pages
3. **Correct dimensions** — 1440px width expected

```bash
ls -la clients/{client-slug}/presentation-artifacts/screenshots/
# Check all 5 files exist and are > 50KB
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `curl` returns 404 | Volume mount path wrong | Verify `$(pwd)` resolves correctly; use absolute paths |
| `curl` returns connection refused | Container not running | `docker ps` to check; `docker restart` if stopped |
| MCP Playwright can't connect | Needs container IP, not localhost | Use `docker inspect` to get IP, navigate to `http://{IP}/` |
| Chrome crashes on `--screenshot` | Missing `--disable-gpu` flag | Add `--disable-gpu` to Chrome flags |
| Screenshots are blank | Page hasn't loaded before capture | Add `--virtual-time-budget=5000` flag |
| Port already in use | Another container on 8080 | `docker stop` old container or use `-p 8081:80` |
| Screenshots not appearing on host | Using MCP Playwright inside container | Switch to host-side `google-chrome --headless` or `docker cp` |

---

## Output Handoff

After screenshots are generated and verified, pass control to:
- **`notion-brand-publisher`** skill — Upload screenshots and links to Notion client page
- **Client communication** — Share `http://localhost:8080/` URL (or container IP) with client