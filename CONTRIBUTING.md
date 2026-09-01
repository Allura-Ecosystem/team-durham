# Contributing

1. Create a focused branch from `main`.
2. Change canonical source, not generated catalog copies or preserved compatibility surfaces.
3. Keep the 12 canonical roles / 13 loadable definitions distinction explicit.
4. Add or update contracts and evaluations when behavior changes.
5. Run:

```bash
npm test
npm run export:check
gitleaks dir --config .gitleaks.toml .
git diff --check
```

Pull requests should describe the user-visible behavior, authority boundary, degraded behavior, and verification evidence. Do not include client-confidential artifacts or credentials.
