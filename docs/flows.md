# User flows

## Default run

1. User adds `pixeltxt.yaml` (or `.yml` / `.json`) next to assets.
2. User runs `pixeltxt run` from that directory (or passes `--cwd`).
3. Pixeltxt resolves `base` and `output` relative to `--cwd`, validates config, composites layers, writes the output file.

## Custom config path

1. User runs `pixeltxt run --config ./configs/staging.yaml`.
2. Format is inferred from the file extension (`.json` vs YAML otherwise).

## Programmatic use

1. Consumer imports `loadConfigFile`, `resolveConfigPath`, or `processImage` from the `pixeltxt-cli` package.
2. Same validation and pipeline apply without spawning the CLI.
