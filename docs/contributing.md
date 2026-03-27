# Contributing

Start with the root **[CONTRIBUTING.md](../CONTRIBUTING.md)** (policy, releases, code of conduct). This file documents **local tooling** (hooks, commands, coverage).

## Git hooks (Husky)

| Hook           | What runs                                                                                                             |
| -------------- | --------------------------------------------------------------------------------------------------------------------- |
| **pre-commit** | [lint-staged](https://github.com/lint-staged/lint-staged): ESLint with `--fix` and Prettier on **staged** files only. |
| **commit-msg** | [Commitlint](https://commitlint.js.org/) with [Conventional Commits](https://www.conventionalcommits.org/).           |
| **pre-push**   | Full `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:coverage` (with thresholds), and `pnpm run audit`.         |

To skip hooks in an emergency (not recommended): `HUSKY=0 git push` or `HUSKY=0 git commit`.

## Commit messages

Use Conventional Commits, for example:

- `feat: add JPEG quality option`
- `fix: resolve config path on Windows`
- `docs: update testing section`
- `chore: bump devDependencies`

`subject-case` is disabled so subjects can be written in Spanish or English without forced casing.

## Checks you can run locally

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run test:coverage   # HTML report: coverage/index.html
pnpm run audit           # dependency vulnerabilities (moderate+)
```

## Coverage

Coverage is collected from `src/**/*.ts` (the public library and CLI source), excluding `src/index.ts` (barrel re-exports). Thresholds are defined in [`vitest.config.ts`](../vitest.config.ts). If `test:coverage` fails, raise coverage with tests or adjust thresholds deliberately in a dedicated commit.

## Security audit

`pnpm audit` uses the npm advisory database. It may report dev-only issues; review and upgrade or accept risk as appropriate. For deeper scanning in CI, consider [Snyk](https://snyk.io/) or [Socket](https://socket.dev/) with their own tokens (not wired into local hooks here).
