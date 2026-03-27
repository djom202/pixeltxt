import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { pixeltxtConfigSchema } from '../../src/config/schema.js';
import { processImage } from '../../src/pipeline/processImage.js';
import { readRgbLumaStats } from '../support/imageStats.js';
import { TEST_FONT_WOFF2_PATH } from '../support/paths.js';

/** Region covering expected glyph bbox for white text at (14, 44) size 28. */
const ROI_TEXT: { left: number; top: number; width: number; height: number } = {
  left: 4,
  top: 4,
  width: 86,
  height: 48,
};

/** Region for red second label at ~(78, 44) on 120px-wide canvas. */
const ROI_RED: { left: number; top: number; width: number; height: number } = {
  left: 66,
  top: 4,
  width: 52,
  height: 48,
};

const W = 120;
const H = 56;
const BG = { r: 20, g: 30, b: 40 };

describe('processImage visual correctness', () => {
  const dirs: string[] = [];

  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  async function makeBasePng(dir: string): Promise<void> {
    await sharp({
      create: {
        width: W,
        height: H,
        channels: 3,
        background: BG,
      },
    })
      .png()
      .toFile(join(dir, 'in.png'));
  }

  it('increases luminance in text ROI when white text is composited', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-vis-'));
    dirs.push(dir);
    await makeBasePng(dir);

    const baseBuf = await readFile(join(dir, 'in.png'));
    const baseStats = await readRgbLumaStats(baseBuf, ROI_TEXT);

    const config = pixeltxtConfigSchema.parse({
      base: 'in.png',
      output: 'out.png',
      layers: [
        {
          type: 'text',
          text: 'MM',
          x: 14,
          y: 44,
          fontSize: 28,
          color: '#ffffff',
          fontPath: TEST_FONT_WOFF2_PATH,
        },
      ],
    });
    await processImage(dir, config);

    const outBuf = await readFile(join(dir, 'out.png'));
    const outStats = await readRgbLumaStats(outBuf, ROI_TEXT);

    expect(outStats.meanLuma).toBeGreaterThan(baseStats.meanLuma + 18);
    expect(outStats.maxLuma).toBeGreaterThan(baseStats.maxLuma + 35);
  });

  it('output differs from base in text ROI (luma and peak)', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-vis2-'));
    dirs.push(dir);
    await makeBasePng(dir);

    const baseBuf = await readFile(join(dir, 'in.png'));
    const baseStats = await readRgbLumaStats(baseBuf, ROI_TEXT);

    await processImage(
      dir,
      pixeltxtConfigSchema.parse({
        base: 'in.png',
        output: 'out.png',
        layers: [
          {
            type: 'text',
            text: 'Z',
            x: 20,
            y: 44,
            fontSize: 32,
            color: '#eeeeee',
            fontPath: TEST_FONT_WOFF2_PATH,
          },
        ],
      }),
    );

    const outBuf = await readFile(join(dir, 'out.png'));
    const outStats = await readRgbLumaStats(outBuf, ROI_TEXT);

    expect(outStats.meanLuma).toBeGreaterThan(baseStats.meanLuma + 5);
    expect(outStats.maxLuma).toBeGreaterThan(baseStats.maxLuma + 20);
  });

  it('second red layer increases mean R in right ROI vs single white layer', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-vis3-'));
    dirs.push(dir);
    await makeBasePng(dir);

    await processImage(
      dir,
      pixeltxtConfigSchema.parse({
        base: 'in.png',
        output: 'one.png',
        layers: [
          {
            type: 'text',
            text: 'AA',
            x: 8,
            y: 44,
            fontSize: 24,
            color: '#ffffff',
            fontPath: TEST_FONT_WOFF2_PATH,
          },
        ],
      }),
    );

    await processImage(
      dir,
      pixeltxtConfigSchema.parse({
        base: 'in.png',
        output: 'two.png',
        layers: [
          {
            type: 'text',
            text: 'AA',
            x: 8,
            y: 44,
            fontSize: 24,
            color: '#ffffff',
            fontPath: TEST_FONT_WOFF2_PATH,
          },
          {
            type: 'text',
            text: 'BB',
            x: 72,
            y: 44,
            fontSize: 24,
            color: '#ff2020',
            fontPath: TEST_FONT_WOFF2_PATH,
          },
        ],
      }),
    );

    const oneBuf = await readFile(join(dir, 'one.png'));
    const twoBuf = await readFile(join(dir, 'two.png'));
    const oneR = await readRgbLumaStats(oneBuf, ROI_RED);
    const twoR = await readRgbLumaStats(twoBuf, ROI_RED);

    expect(twoR.meanR - oneR.meanR).toBeGreaterThan(18);
  });
});
