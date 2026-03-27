# Pixeltxt

CLI tool to automate image personalization by compositing text layers on a base image. Built with **Sharp** for fast raster work and **Commander** for argument parsing. Configuration uses visible filenames (`pixeltxt.yaml`, `pixeltxt.yml`, or `pixeltxt.json`).

**Package (npm):** `pixeltxt-cli` — **command:** `pixeltxt`

**Documentation site (GitHub Pages):** [djom202.github.io/pixeltxt](https://djom202.github.io/pixeltxt/)

## Tech stack

- Node.js 20+
- TypeScript (strict)
- Sharp (image I/O and compositing)
- Commander (CLI)
- js-yaml + JSON (configuration)
- Zod (runtime validation)

## Install

```bash
npm install -g pixeltxt-cli
# or
pnpm add -g pixeltxt-cli
```

Local development:

```bash
pnpm install
pnpm run build
pnpm link --global   # optional: global `pixeltxt` points to this repo
```

## Usage

1. Add a config file to your folder (no leading dot), for example `pixeltxt.yaml`.
2. Run:

```bash
pixeltxt run
```

Options:

```text
pixeltxt run [options]

Options:
  -c, --config <file>   Path to config file (JSON or YAML)
  --cwd <dir>           Working directory for relative paths (default: process.cwd())
```

### Docker

```bash
docker compose run --rm pixeltxt
```

Mounts the current directory at `/work` and runs `pixeltxt run --cwd /work`.

## Configuration

| Field    | Description                                               |
| -------- | --------------------------------------------------------- |
| `base`   | Path to input image (JPG, PNG, WebP, SVG, etc.)           |
| `output` | Path to output (`.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`) |
| `layers` | Ordered list of layers (currently `type: text`)           |

### Text layer

| Field         | Type   | Description                                     |
| ------------- | ------ | ----------------------------------------------- |
| `type`        | `text` | Required discriminator                          |
| `text`        | string | Content; use `\n` for multiple lines            |
| `x`, `y`      | number | Position in pixels                              |
| `fontSize`    | number | Default `24`                                    |
| `color`       | string | Default `#ffffff`                               |
| `fontFamily`  | string | Default `sans-serif` (when `fontPath` omitted)  |
| `fontPath`    | string | Optional path to TTF/OTF for headless rendering |
| `anchor`      | string | `start`, `middle`, or `end` (SVG `text-anchor`) |
| `stroke`      | string | Optional stroke color                           |
| `strokeWidth` | number | Default `0`                                     |

### Example `pixeltxt.yaml`

See [`examples/pixeltxt.yaml`](./examples/pixeltxt.yaml).

### Example `pixeltxt.json`

```json
{
  "base": "./input.png",
  "output": "./output.webp",
  "layers": [
    {
      "type": "text",
      "text": "Hello",
      "x": 32,
      "y": 64,
      "fontSize": 48,
      "color": "#111827"
    }
  ]
}
```

## SVG input and output

- **Input**: Sharp can rasterize SVG when supported by the installed libraries.
- **Output `.svg`**: The result is a valid SVG file wrapping a base64 PNG of the final composite (not a pure vector export).

## Scripts

| Script                        | Description                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `pnpm run build`              | Compile to `dist/`                                                                |
| `pnpm run dev`                | Run CLI via `tsx`                                                                 |
| `pnpm run lint`               | ESLint                                                                            |
| `pnpm run format`             | Prettier                                                                          |
| `pnpm test`                   | Build + Vitest (includes `dist/cli.js` subprocess checks)                         |
| `pnpm run test:golden`        | Build + pixelmatch comparison against `examples/fixtures/golden/text-overlay.png` |
| `pnpm run test:golden:update` | Regenerate that golden PNG (run after intentional rendering changes)              |
| `pnpm run test:coverage`      | Build + Vitest with coverage (thresholds on `src/`; see `coverage/index.html`)    |
| `pnpm run audit`              | `pnpm audit --audit-level=moderate` (dependency advisories)                       |

See [`docsfiles/testing.md`](./docsfiles/testing.md) for visual and golden test details.

## Development workflow

Husky runs **lint-staged** on commit, **Commitlint** on the message (Conventional Commits), and **lint + typecheck + tests with coverage + audit** on push. See [`docsfiles/contributing.md`](./docsfiles/contributing.md).

## Architecture

See [`docsfiles/architecture.md`](./docsfiles/architecture.md).

## Publishing to npm

Releases are automated with **[release-please](https://github.com/googleapis/release-please)** (see [`.github/workflows/release-please.yml`](./.github/workflows/release-please.yml)): merge its release PR to bump `package.json`, update [`CHANGELOG.md`](./CHANGELOG.md), and tag—then publish from the release artifact or locally after merge.

Manual publish (maintainers): log in with `npm login`, ensure `repository` / `homepage` in [`package.json`](./package.json) match your Git remote, then `npm publish` after `prepublishOnly` runs `npm run clean && npm run build`. Inspect the tarball with `npm pack --dry-run`.

See root [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the full contribution and release policy.

## License

[MIT](./LICENSE)
