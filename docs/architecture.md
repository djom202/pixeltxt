# Pixeltxt architecture

## Overview

Pixeltxt is a Node.js CLI that reads a visible configuration file (`pixeltxt.yaml`, `pixeltxt.yml`, or `pixeltxt.json`), loads a base raster or SVG input via [Sharp](https://sharp.pixelplumbing.com/), and composites ordered layers on top. Text layers are rendered by generating a same-size SVG overlay and rasterizing it with Sharp before compositing.

## Modules

| Area       | Responsibility                                            |
| ---------- | --------------------------------------------------------- |
| `cli`      | Commander program, `run` subcommand, process exit codes   |
| `commands` | Orchestration for `run` (resolve paths, load config, I/O) |
| `config`   | Default filename discovery, JSON/YAML parsing, Zod schema |
| `pipeline` | SVG text builder, Sharp pipeline, output format handling  |

## Configuration flow

1. Resolve working directory (`--cwd`, default `process.cwd()`).
2. Locate config: explicit `--config` or first existing file among `pixeltxt.yaml`, `pixeltxt.yml`, `pixeltxt.json` (in that order).
3. Infer format from extension; parse with `JSON.parse` or `js-yaml`.
4. Validate with `pixeltxtConfigSchema` (Zod).

## Image pipeline

1. `sharp(base)` reads metadata for `width` and `height`.
2. For each text layer, build a full-canvas SVG with `<text>` / `<tspan>` (multi-line supported).
3. Rasterize each SVG overlay to PNG with alpha and `composite` in order.
4. Encode output from the `output` path extension: `.jpg`/`.jpeg`, `.png`, `.webp`, or `.svg`.

### SVG output

Sharp does not emit vector SVG for composited results. For `.svg` output, Pixeltxt writes a minimal SVG document that embeds the final raster as a base64 PNG `data:` URL inside an `<image>` element. This keeps the file valid SVG for tools that require the extension while preserving the visual result.

## Extensibility

Future layer types (e.g. image stamps, watermarks) can extend the Zod discriminated union and append additional `composite` inputs in `processImage`.

## Source layout

| Location    | Contents                                                                               |
| ----------- | -------------------------------------------------------------------------------------- |
| `src/`      | Published library and CLI (`cli`, `commands`, `config`, `pipeline`)                    |
| `tests/`    | Vitest specs (mirror of `src/`) and `tests/support/` helpers                           |
| `examples/` | Sample configs, sample images, and `examples/fixtures/` (fonts + golden PNG for tests) |
