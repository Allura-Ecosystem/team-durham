---
name: security-bluebook-builder
description: Create or refine a concise, normative security policy ("Blue Book") for sensitive applications. Use when users need a threat model, data classification rules, auth/session policy, logging and audit requirements, retention/deletion expectations, incident response, or security gates for apps handling PII/PHI/financial data.
version: 1.0.0
author: SHADOWPR0
type: skill
category: review
tags:
  - security
  - threat-modeling
  - compliance
  - bluebook
  - policy
  - audit
---

# Security Bluebook Builder

## Overview

Build a minimal but real security policy for sensitive apps. The output is a single, coherent Blue Book document using MUST/SHOULD/CAN language, with explicit assumptions, scope, and security gates.

> **Repository:** https://github.com/SHADOWPR0/security-bluebook-builder

---

## Workflow

### 1) Gather Inputs (ask only if missing)

Collect just enough context to fill the template. If the user has not provided details, ask up to 6 short questions:

- What data classes are handled (PII, PHI, financial, tokens, content)?
- What are the trust boundaries (client/server/third parties)?
- How do users authenticate (OAuth, email/password, SSO, device sessions)?
- What storage is used (DB, object storage, logs, analytics)?
- What connectors or third parties are used?
- Retention and deletion expectations (default + user-initiated)?

If the user cannot answer, proceed with safe defaults and mark TODOs.

---

### 2) Draft the Blue Book

Load the bluebook template and fill it with the provided details. Keep it concise, deterministic, and enforceable.

**Blue Book Structure:**

```markdown
# {Application Name} Security Blue Book

## 1. Scope & Assumptions
- Application purpose and data sensitivity level
- Trust boundaries diagram
- Out-of-scope items

## 2. Threat Model
- Threat actors and capabilities
- Attack surfaces
- Mitigations per surface

## 3. Data Classification & Handling
- Data classes (PII, PHI, financial, tokens, content)
- Handling rules per class (storage, transit, retention)
- Encryption requirements

## 4. Authentication & Session Policy
- Auth mechanisms
- Session duration and renewal
- MFA requirements
- Token handling (generation, rotation, revocation)

## 5. Authorization & Access Control
- RBAC/ABAC model
- Principle of least privilege
- API key scoping

## 6. Logging & Audit
- What to log (auth events, data access, admin actions)
- What NOT to log (secrets, PII in clear)
- Log retention and protection
- Audit trail requirements

## 7. Retention & Deletion
- Default retention periods per data class
- User-initiated deletion flow
- Compliance requirements (GDPR, CCPA, HIPAA)

## 8. Incident Response
- Detection triggers
- Escalation path
- Containment steps
- Post-mortem template

## 9. Security Gates (Go/No-Go)
- Pre-deployment checklist
- Runtime monitoring requirements
- Periodic review cadence
```

---

### 3) Enforce Guardrails

- Do not include secrets, tokens, or internal credentials
- If something is unknown, write "TODO" plus a clear assumption
- Fail closed: if a capability is required but unavailable, call it out explicitly
- Keep scope minimal; do not add features or tools beyond what the user asked for
- Use MUST/SHOULD/CAN language consistently (RFC 2119 style)

---

### 4) Quality Checks

Confirm the Blue Book includes:

- [ ] Threat model (assumptions + out-of-scope)
- [ ] Data classification + handling rules
- [ ] Trust boundaries + controls
- [ ] Auth/session policy
- [ ] Token handling policy
- [ ] Logging/audit policy
- [ ] Retention/deletion
- [ ] Incident response mini-runbook
- [ ] Security gates + go/no-go checklist

---

## Integration with Harness

### With Pike (pike-interface-review)

Pike reviews the Blue Book for interface-level security gaps — open endpoints, missing auth checks, unclear trust boundaries.

### With Varlock

The Blue Book defines WHERE secrets live and how they must be handled. Varlock enforces that they never leak.

### With Brooks (brooks-architect)

Brooks uses the Blue Book as an ADR input — security constraints feed into architecture decisions.

---

## Never Do This

- Include actual secrets, tokens, or credentials in Blue Book output
- Skip the threat model section
- Mark unknowns as "N/A" instead of "TODO"
- Add security controls the team cannot enforce
- Create a Blue Book longer than necessary (aim for 1-3 pages)

## Always Do This

- Use MUST/SHOULD/CAN language for normative requirements
- Mark all unknowns as TODO with explicit assumptions
- Fail closed on security requirements
- Reference Varlock for secret handling patterns
- Keep scope minimal and enforceable
- Review Blue Books with Pike for interface gaps