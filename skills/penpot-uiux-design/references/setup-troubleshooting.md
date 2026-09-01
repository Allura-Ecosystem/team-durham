# Penpot MCP Server Setup & Troubleshooting

Complete guide for installing, configuring, and troubleshooting the Penpot MCP Server.

## Architecture Overview

The Penpot MCP integration requires **three components** working together:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   MCP Client    │────▶│   MCP Server    │◀───▶│  Penpot Plugin  │
│ (VS Code/Claude)│     │  (port 4401)    │     │ (in browser)    │
└─────────────────┘     └────────┬────────┘     └────────┬────────┘
                                 │                       │
                                 │    WebSocket          │
                                 │    (port 4402)        │
                                 └───────────────────────┘
```

1. **MCP Server** - Exposes tools to your AI client (HTTP on port 4401)
2. **Plugin Server** - Serves the Penpot plugin files (HTTP on port 4400)
3. **Penpot MCP Plugin** - Runs inside Penpot browser, executes design commands

## Quick Start (Recommended)

The easiest way to run the Penpot MCP server is using the official npm package:

```bash
# Start Penpot Docker stack (if not already running)
docker compose -f docker/penpot/docker-compose.yml up -d

# Start MCP server + plugin server
npx -y @penpot/mcp@latest
```

This single command:
- Installs and builds the MCP server and plugin
- Starts the plugin server on port 4400
- Starts the MCP server on port 4401 (HTTP) + WebSocket on port 4402
- Starts a debug REPL on port 4403

### Persistent Background Start

```bash
nohup npx -y @penpot/mcp@latest > /tmp/penpot-mcp.log 2>&1 &
```

### Stopping the MCP Server

```bash
pkill -f '@penpot/mcp' || true
```

## Prerequisites

- **Node.js v22+** - [Download](https://nodejs.org/)
- **Docker** - For running the Penpot self-hosted instance
- **Modern browser** - Chrome, Firefox, or Chromium-based browser

Verify Node.js installation:
```bash
node --version  # Should be v22.x or higher
npm --version
npx --version
```

## Step-by-Step Setup

### Step 1: Start Penpot Self-Hosted

```bash
# From Brand Maker root directory
docker compose -f docker/penpot/docker-compose.yml up -d
```

Wait for all services to be healthy (about 15-30 seconds), then open http://localhost:9001 and register.

### Step 2: Start the MCP Server

```bash
npx -y @penpot/mcp@latest
```

**Expected output:**
```
INFO Registering tool: execute_code
INFO Registering tool: high_level_overview
INFO Registering tool: penpot_api_info
INFO Registering tool: export_shape
INFO Registering tool: import_image
INFO WebSocket mcpServer started on port 4402
INFO Modern Streamable HTTP endpoint: http://localhost:4401/mcp
INFO Legacy SSE endpoint: http://localhost:4401/sse
```

### Step 3: Load the Plugin in Penpot

1. Open http://localhost:9001 in your browser
2. Navigate to a design file (create one if needed)
3. Open the **Plugins** menu
4. Click **Load plugin from URL**
5. Enter: `http://localhost:4400/manifest.json`
6. Open the plugin UI
7. Click **"Connect to MCP server"**
8. Status should change to **"Connected to MCP server"**

> **Important**: Keep the plugin UI open while using MCP tools. Closing it disconnects the server.

### Step 4: Configure Your MCP Client

#### OpenCode (`opencode.json`)

**IMPORTANT**: The Penpot MCP server only supports HTTP/SSE transport, NOT stdio. You MUST use `"type": "remote"` with the URL, NOT `"type": "local"` with a command.

```json
{
  "mcp": {
    "penpot": {
      "type": "remote",
      "url": "http://localhost:4401/mcp",
      "enabled": true
    }
  }
}
```

The MCP server process must be started separately before OpenCode connects:

```bash
nohup npx -y @penpot/mcp@latest > /tmp/penpot-mcp.log 2>&1 &
```

#### VS Code with GitHub Copilot

Add to your VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "penpot": {
        "url": "http://localhost:4401/mcp"
      }
    }
  }
}
```

Or use the SSE endpoint:

```json
{
  "mcp": {
    "servers": {
      "penpot": {
        "url": "http://localhost:4401/sse"
      }
    }
  }
}
```

#### Claude Desktop

Claude Desktop requires the `mcp-remote` proxy (stdio-only transport):

1. Install the proxy:
   ```bash
   npm install -g mcp-remote
   ```

2. Edit Claude Desktop config:
   - **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

3. Add the Penpot server:
   ```json
   {
     "mcpServers": {
       "penpot": {
         "command": "npx",
         "args": ["-y", "mcp-remote", "http://localhost:4401/mcp", "--allow-http"]
       }
     }
   }
   ```

4. **Fully quit** Claude Desktop (File → Quit, not just close window) and restart

#### Claude Code (CLI)

```bash
claude mcp add penpot -t http http://localhost:4401/mcp
```

## Penpot Docker Configuration

The Penpot self-hosted instance runs on Docker with these services:

| Service | Image | Port |
|---------|-------|------|
| penpot-frontend | penpotapp/frontend:2.14.3 | 9001→8080 |
| penpot-backend | penpotapp/backend:2.14.3 | internal |
| penpot-exporter | penpotapp/exporter:2.14.3 | internal |
| penpot-postgres | postgres:15 | internal:5432 |
| penpot-valkey | valkey/valkey:8.1 | internal:6379 |

### Environment Variables

The Penpot Docker stack uses these defaults (configured in `docker/penpot/docker-compose.yml`):

- `PENPOT_PORT`: Frontend port (default: 9001)
- Registration is enabled with demo users
- Email verification is disabled for local development
- No SMTP configured

## MCP Server Configuration

The MCP server can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PENPOT_MCP_SERVER_HOST` | Address the MCP server binds to | `localhost` |
| `PENPOT_MCP_SERVER_PORT` | HTTP/SSE server port | `4401` |
| `PENPOT_MCP_WEBSOCKET_PORT` | WebSocket server port | `4402` |
| `PENPOT_MCP_REPL_PORT` | REPL debug server port | `4403` |
| `PENPOT_MCP_SERVER_ADDRESS` | Hostname/IP clients use to reach server | `localhost` |
| `PENPOT_MCP_REMOTE_MODE` | Disable filesystem access for remote | `false` |
| `PENPOT_MCP_LOG_LEVEL` | Log level (trace/debug/info/warn/error) | `info` |
| `PENPOT_MCP_LOG_DIR` | Directory for log files | `logs` |

### Custom Ports Example

```bash
PENPOT_MCP_SERVER_PORT=5000 \
PENPOT_MCP_WEBSOCKET_PORT=5001 \
PENPOT_MCP_LOG_LEVEL=debug \
npx -y @penpot/mcp@latest
```

## Troubleshooting

### Connection Issues

#### "Plugin cannot connect to MCP server"

**Symptoms**: Plugin shows "Not connected" even after clicking Connect

**Solutions**:
1. Verify servers are running:
   ```bash
   lsof -i :4401  # MCP server
   lsof -i :4402  # WebSocket
   lsof -i :4400  # Plugin server
   ```

2. Restart the MCP server:
   ```bash
   pkill -f '@penpot/mcp'
   npx -y @penpot/mcp@latest
   ```

3. Check browser console (F12) for WebSocket errors

#### Browser Blocks Local Connection

**Symptoms**: Browser refuses to connect to localhost from Penpot

**Cause**: Chromium 142+ enforces Private Network Access (PNA) restrictions

**Solutions**:
1. **Chrome/Chromium**: When prompted, allow access to local network
2. **Brave**: Disable Shield for the Penpot website:
   - Click the Brave Shield icon in address bar
   - Toggle Shield off for this site
3. **Try Firefox**: Firefox doesn't enforce these restrictions as strictly

#### "WebSocket connection failed"

**Solutions**:
1. Check firewall settings - allow ports 4400, 4401, 4402
2. Disable VPN if active
3. Check for conflicting applications using the same ports

### MCP Client Issues

#### Tools Not Appearing in OpenCode/VS Code/Claude

1. **Verify endpoint:**
   ```bash
   # Test the MCP endpoint (406 is normal for plain GET requests)
   curl -s -o /dev/null -w "%{http_code}" http://localhost:4401/mcp
   # Expected: 406

   # Test the full MCP handshake (should return JSON with protocolVersion)
   curl -s -H "Content-Type: application/json" -H "Accept: application/json, text/event-stream" \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}' \
     http://localhost:4401/mcp
   # Expected: SSE event with initialize result

   # Test the SSE endpoint
   curl http://localhost:4401/sse
   ```

2. **Check configuration syntax** — JSON must be valid
3. **OpenCode CRITICAL**: Use `"type": "remote"` with `"url"`, NOT `"type": "local"` with `"command"`. The Penpot MCP server does NOT support stdio transport. Using `"type": "local"` will cause `MCP error -32000: Connection closed`.
4. **Restart the MCP client** completely (OpenCode requires restart after config changes)
5. **Check MCP server logs**:
   ```bash
   tail -f /tmp/penpot-mcp.log
   ```
6. **Verify OpenCode sees penpot as connected**:
   ```bash
   opencode mcp list
   # Should show: ✓ penpot connected
   ```

#### "Tool execution timed out"

**Cause**: Plugin disconnected or operation took too long

**Solutions**:
1. Ensure plugin UI is still open in Penpot
2. Verify plugin shows "Connected" status
3. Try reconnecting: click Disconnect then Connect in plugin

### Plugin Issues

#### "Plugin failed to load"

1. Verify plugin server is running on port 4400
2. Try accessing `http://localhost:4400/manifest.json` directly in browser
3. Clear browser cache and reload Penpot
4. Remove and re-add the plugin

#### "Cannot find penpot object"

**Cause**: Plugin not properly initialized or design file not open

**Solutions**:
1. Make sure you have a design file open (not just the dashboard)
2. Wait a few seconds after opening file before connecting
3. Refresh Penpot and reload the plugin

### Docker Issues

#### Penpot UI Not Loading on localhost:9001

1. Check containers are running:
   ```bash
   docker compose -f docker/penpot/docker-compose.yml ps
   ```
2. Check backend logs:
   ```bash
   docker logs penpot_backend --tail 50
   ```
3. The backend takes ~30 seconds to start; wait and refresh

#### PostgreSQL Migration Errors on Upgrade

If upgrading from an older Penpot version:
```bash
# Backup first!
docker compose -f docker/penpot/docker-compose.yml exec penpot-postgres \
  pg_dump -U penpot penpot > penpot-backup.sql

# Remove old data if migration fails (CAUTION: destroys data)
docker volume rm penpot_penbot_pg_data

# Start fresh
docker compose -f docker/penpot/docker-compose.yml up -d
```

### Port Already in Use

```bash
# Find process using the port
lsof -i :4401

# Kill the process if needed
kill <PID>
```

## MCP Tools Reference

| Tool | Description |
|------|-------------|
| `mcp__penpot__execute_code` | Run JavaScript in Penpot plugin context to create/modify designs |
| `mcp__penpot__export_shape` | Export shapes as PNG/SVG for visual inspection |
| `mcp__penpot__import_image` | Import images (icons, photos, logos) into designs |
| `mcp__penpot__penpot_api_info` | Retrieve Penpot API documentation |
| `mcp__penpot__high_level_overview` | Get an overview of the current design file |

## Source Code Reference

The official MCP server source code is in the main Penpot repository:
- **Repository**: https://github.com/penpot/penpot (directory: `mcp/`)
- **npm Package**: `@penpot/mcp` on npm
- **Archived separate repo**: https://github.com/penpot/penpot-mcp (merged into main repo)

## Support

- **GitHub Issues**: [penpot/penpot/issues](https://github.com/penpot/penpot/issues)
- **GitHub Discussions**: [penpot/penpot/discussions](https://github.com/penpot/penpot/discussions)
- **Penpot Community**: [community.penpot.app](https://community.penpot.app)