# Contributing to Pixeltxt

Thank you for your interest in **pixeltxt-cli**. This document is the entry point for
contributors; detailed local tooling (Husky, coverage, audit) lives in
[`docs/contributing.md`](docs/contributing.md).

## Code of conduct

Be respectful and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/)
as a baseline for community behavior.

## Open development

Work happens on GitHub: [issues](https://github.com/djom202/pixeltxt/issues) and pull requests
welcome. For **non-trivial** API or behavior changes, open an issue first so we can align before
you invest heavy effort.

## Semantic versioning and releases

This project uses [Semantic Versioning](https://semver.org/). Releases and `CHANGELOG.md` updates
are driven by **[release-please](https://github.com/googleapis/release-please)** from
[Conventional Commits](https://www.conventionalcommits.org/) on `main`. Merge the release PR
when it appears—do not manually bump versions or rewrite release sections of `CHANGELOG.md` on
`main` outside that process.

## Reporting bugs

Use [Bug report](https://github.com/djom202/pixeltxt/issues/new?template=bug_report.md) and include:

- `pixeltxt` / package version, Node version, OS
- Minimal config and steps (`pixeltxt run`, `--cwd`, `-c` if needed)
- A small repo or zip repro if the issue is not obvious

Security issues: do not file public issues with exploit details; use GitHub private vulnerability
reporting if enabled for the repository, or contact the maintainers privately.

## Local development

Clone the repository, install dependencies, and run checks before opening a PR:

```bash
pnpm install
pnpm run build
pnpm run lint
pnpm run typecheck
pnpm test
```

Commit messages must pass **Commitlint** (Conventional Commits). Hooks run **lint-staged** on
commit and broader checks on push—see [`docs/contributing.md`](docs/contributing.md) for the
full table and coverage/audit notes.

## License

By contributing, you agree that your contributions are licensed under the same license as the
project ([MIT](LICENSE)).
