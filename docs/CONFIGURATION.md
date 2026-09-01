# Configuration

Team Durham stores no credentials. Configure integrations in the calling runtime's environment or secret manager.

## Core behavior

No environment variables are required to load the definitions, inspect a brief, create file-based strategy, or run repository validation.

## Optional integrations

| Integration | Typical configuration | Scope and safety |
| --- | --- | --- |
| Allura Memory / Brain | Configure the `allura-brain` MCP server in the client | Use the deployment's authenticated scope and `group_id = allura-team-durham`; never place tokens in this repo |
| Figma | Configure a Figma MCP server; provide `FIGMA_TOKEN` only if that server requires it | Treat file keys as resource identifiers, not credentials; do not publish private client designs |
| fal.ai | `FAL_KEY` | Keep in a secret store; generated media still requires QA and approval |
| Notion | `NOTION_TOKEN` | Limit integration permissions to intended pages/workspaces |
| Docker MCP toolkit | Docker daemon plus gateway/client configuration | Review every enabled tool and mount; do not grant broad host access by default |
| LibreOffice MCP | `MCP_LIBRE_ROOT` plus `fastmcp` | Point to a trusted local install; validate output before delivery |

Variable names are conventions used by bundled skills. The actual MCP client may use a different secret-binding mechanism; prefer that mechanism over shell-wide exports.

## Client scope

A client workspace should define:

- approved brief and owner
- canonical brand-truth location
- allowed output directories
- integration permissions
- evidence and approval requirements
- memory scope/group

Do not put real client work in the public `clients/` tree. The existing directory is preserved historical workspace material and is excluded from catalog export.

## Model routing

Agent files contain runtime-facing model hints. Runtimes may map those hints to available models, but substitutions must preserve capability requirements (especially vision), permissions, and read-only QA boundaries. A model substitution is not permission to broaden tools.

## Secret scanning

Run before every publication:

```bash
gitleaks dir --config .gitleaks.toml .
```

The repository config extends the standard Gitleaks rules and narrowly allows only documented non-secret semantic identifiers.
