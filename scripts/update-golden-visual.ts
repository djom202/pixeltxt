/**
 * Regenerates examples/fixtures/golden/text-overlay.png using the same pipeline as processImage.golden.test.ts.
 * Run after intentional rendering changes: pnpm run test:golden:update
 */
import { copyFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { processImage } from '../src/pipeline/processImage.js';
import {
  buildGoldenPixeltxtConfig,
  GOLDEN_BACKGROUND,
  GOLDEN_IMAGE_HEIGHT,
  GOLDEN_IMAGE_WIDTH,
} from '../tests/support/goldenConfig.js';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const goldenDir = join(repoRoot, 'examples/fixtures/golden');
const goldenPath = join(goldenDir, 'text-overlay.png');

const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-golden-'));
try {
  await sharp({
    create: {
      width: GOLDEN_IMAGE_WIDTH,
      height: GOLDEN_IMAGE_HEIGHT,
      channels: 3,
      background: GOLDEN_BACKGROUND,
    },
  })
    .png()
    .toFile(join(dir, 'base.png'));

  await processImage(dir, buildGoldenPixeltxtConfig());
  await mkdir(goldenDir, { recursive: true });
  await copyFile(join(dir, 'golden-out.png'), goldenPath);
  console.log('Updated', goldenPath);
} finally {
  await rm(dir, { recursive: true, force: true });
}
