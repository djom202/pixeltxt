# Testing

Vitest runs specs under [`tests/`](../tests) (mirroring [`src/`](../src)). Shared test helpers live in [`tests/support/`](../tests/support). Binary assets (font subset, golden PNG) live under [`examples/fixtures/`](../examples/fixtures).

## Default suite (`pnpm test`)

Runs a production build (for `dist/cli.js` subprocess checks) then Vitest with all `tests/**/*.test.ts` **except** `*.golden.test.ts`.

Includes **visual correctness** tests ([`tests/pipeline/processImage.visual.test.ts`](../tests/pipeline/processImage.visual.test.ts)) that assert luminance and channel changes in fixed ROIs after compositing text. They use the bundled font [`examples/fixtures/fonts/IBMPlexSans-Regular-Latin1.woff2`](../examples/fixtures/fonts/README.md) so results do not depend on system fonts.

## Golden PNG regression (`pnpm run test:golden`)

Compares a fresh `processImage` output to [`examples/fixtures/golden/text-overlay.png`](../examples/fixtures/golden/text-overlay.png) using [pixelmatch](https://github.com/mapbox/pixelmatch) with a small allowed pixel drift (antialiasing / platform differences).

Run when you want stricter visual regression coverage (e.g. in CI on Linux).

## Updating the golden image

After intentional rendering or dependency changes:

```bash
pnpm run test:golden:update
```

Then commit the updated `examples/fixtures/golden/text-overlay.png`.

Regenerate on the **same OS** you use for CI when possible, or re-run `test:golden` in CI and adjust tolerance in [`tests/pipeline/processImage.golden.test.ts`](../tests/pipeline/processImage.golden.test.ts) only if raster differences remain acceptable.

## Environment variables

| Variable        | Purpose                                       |
| --------------- | --------------------------------------------- |
| (none required) | Default and golden suites work out of the box |

Optional: set `PIXELTXT_TEST_FONT` in the future if you add alternate font resolution (not used by the current suite).
