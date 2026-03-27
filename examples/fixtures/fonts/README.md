# Test fonts

## IBMPlexSans-Regular-Latin1.woff2

Subset **IBM Plex Sans** (Latin-1), used for deterministic SVG text rasterization in automated tests.

Full license text: [`IBMPlexSans-LICENSE.txt`](./IBMPlexSans-LICENSE.txt) (SIL Open Font License 1.1).

Source: IBM Plex Sans package; the WOFF2 file was copied into this repo so tests do not depend on `node_modules` layout.

Sharp/resvg accept this format in `@font-face` `url('file://...')` the same as TTF.
