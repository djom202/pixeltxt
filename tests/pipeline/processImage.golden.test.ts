import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { processImage } from '../../src/pipeline/processImage.js';
import {
  buildGoldenPixeltxtConfig,
  GOLDEN_BACKGROUND,
  GOLDEN_IMAGE_HEIGHT,
  GOLDEN_IMAGE_WIDTH,
} from '../support/goldenConfig.js';

const repoRoot = fileURLToPath(new URL('../..', import.meta.url));
const goldenPngPath = join(repoRoot, 'examples/fixtures/golden/text-overlay.png');

describe('processImage golden PNG', () => {
  const dirs: string[] = [];

  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  it('matches committed golden within a small pixel tolerance', async () => {
    const expectedBuf = await readFile(goldenPngPath);

    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-golden-test-'));
    dirs.push(dir);

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
    const actualBuf = await readFile(join(dir, 'golden-out.png'));

    const a = await sharp(expectedBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(actualBuf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

    expect(a.info.width).toBe(b.info.width);
    expect(a.info.height).toBe(b.info.height);
    expect(a.info.channels).toBe(4);
    expect(b.info.channels).toBe(4);

    const { width, height } = a.info;
    const diffCount = pixelmatch(
      new Uint8Array(a.data.buffer, a.data.byteOffset, a.data.byteLength),
      new Uint8Array(b.data.buffer, b.data.byteOffset, b.data.byteLength),
      undefined,
      width,
      height,
      { threshold: 0.12 },
    );

    const totalPx = width * height;
    const maxDiff = Math.max(50, Math.ceil(totalPx * 0.012));
    expect(diffCount).toBeLessThanOrEqual(maxDiff);
  });
});
