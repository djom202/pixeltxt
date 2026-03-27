import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Latin-1 subset WOFF2 (IBM Plex Sans); bundled under examples/fixtures for stable tests. */
export const TEST_FONT_WOFF2_PATH = join(
  __dirname,
  '..',
  '..',
  'examples',
  'fixtures',
  'fonts',
  'IBMPlexSans-Regular-Latin1.woff2',
);
