# Team Durham agent routes

| Public name | Canonical source | Responsibilities |
| --- | --- | --- |
| Kotler | `brand-orchestrator.md` | Orchestration, workflow, authority and trust accountability |
| Aaker | `brand-strategist.md` | Strategy, personality, STP |
| Ogilvy | `copywriter.md` | Naming, messaging and copy |
| Glaser | `visual-director.md` | Visual direction |
| Rand | `brand-kit-builder.md` | Kit assembly and UX artifacts |
| Munari | `qa-reviewer.md` | Independent read-only QA, readiness and trust review |
| Tufte | `data-analyst.md` | Research, recon and evidence capture |

Canonical filenames are source contracts; resolve the public name against the runtime registry before dispatch. Prefer the public name when registered, otherwise the canonical filename stem when registered; if neither exists, report missing invocation capability. Canonical Claude frontmatter names remain valid; no duplicate native registrations are needed. Capability terms such as recon, screenshots, workflow, and readiness select these retained owners; they are not additional registered agents. `/scout` remains a compatibility discovery command routed to Tufte. No runtime generic fallback is required. All routes preserve the active authenticated tenant and approval gates.
