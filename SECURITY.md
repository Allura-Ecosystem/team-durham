# Security Policy

## Reporting

Report vulnerabilities privately through GitHub's security-advisory flow for `Allura-Ecosystem/team-durham`. Do not open a public issue containing credentials, private client data, exploitable prompt-injection examples, or integration endpoints.

## Scope

Security-sensitive surfaces include agent tool permissions, instruction boundaries, memory authorization, provenance, catalog export integrity, and bundled scripts.

## Secrets

This repository intentionally contains no operational credentials. Revoke and rotate any credential committed accidentally, remove it from current content and history as appropriate, and run Gitleaks before republishing.

Only the latest supported release and `main` receive security fixes.
