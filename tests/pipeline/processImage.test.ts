import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it } from 'vitest';
import { pixeltxtConfigSchema } from '../../src/config/schema.js';
import { formatFromOutputPath, processImage } from '../../src/pipeline/processImage.js';

describe('formatFromOutputPath', () => {
  it('maps extensions to formats', () => {
    expect(formatFromOutputPath('out.png')).toBe('png');
    expect(formatFromOutputPath('out.jpg')).toBe('jpeg');
    expect(formatFromOutputPath('out.jpeg')).toBe('jpeg');
    expect(formatFromOutputPath('out.webp')).toBe('webp');
    expect(formatFromOutputPath('out.svg')).toBe('svg');
  });

  it('throws for unsupported extensions', () => {
    expect(() => formatFromOutputPath('out.bmp')).toThrow(/Unsupported output extension/);
  });
});

describe('processImage', () => {
  const dirs: string[] = [];

  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  async function tmpWorkspace(): Promise<string> {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-pi-'));
    dirs.push(dir);
    const basePath = join(dir, 'in.png');
    await sharp({
      create: {
        width: 240,
        height: 120,
        channels: 3,
        background: { r: 20, g: 30, b: 40 },
      },
    })
      .png()
      .toFile(basePath);
    return dir;
  }

  it('writes output png with text layer', async () => {
    const dir = await tmpWorkspace();
    const config = pixeltxtConfigSchema.parse({
      base: 'in.png',
      output: 'out.png',
      layers: [
        {
          type: 'text',
          text: 'OK',
          x: 12,
          y: 72,
          fontSize: 48,
          color: '#ffffff',
        },
      ],
    });

    await processImage(dir, config);
    const outStat = await readFile(join(dir, 'out.png'));
    expect(outStat.byteLength).toBeGreaterThan(100);
    const meta = await sharp(outStat).metadata();
    expect(meta.width).toBe(240);
    expect(meta.height).toBe(120);
  });

  it('copies dimensions with no layers', async () => {
    const dir = await tmpWorkspace();
    const config = pixeltxtConfigSchema.parse({
      base: 'in.png',
      output: 'out.png',
      layers: [],
    });
    await processImage(dir, config);
    const outStat = await readFile(join(dir, 'out.png'));
    const meta = await sharp(outStat).metadata();
    expect(meta.width).toBe(240);
    expect(meta.height).toBe(120);
  });

  it('writes jpeg and webp with correct format metadata', async () => {
    const dir = await tmpWorkspace();
    const baseCfg = {
      base: 'in.png',
      layers: [{ type: 'text' as const, text: 'J', x: 10, y: 40, fontSize: 24, color: '#fff' }],
    };
    await processImage(dir, pixeltxtConfigSchema.parse({ ...baseCfg, output: 'out.jpg' }));
    await processImage(dir, pixeltxtConfigSchema.parse({ ...baseCfg, output: 'out.webp' }));
    const jpgMeta = await sharp(await readFile(join(dir, 'out.jpg'))).metadata();
    const webpMeta = await sharp(await readFile(join(dir, 'out.webp'))).metadata();
    expect(jpgMeta.format).toBe('jpeg');
    expect(webpMeta.format).toBe('webp');
  });

  it('writes svg wrapper with embedded base64 png', async () => {
    const dir = await tmpWorkspace();
    await processImage(
      dir,
      pixeltxtConfigSchema.parse({
        base: 'in.png',
        output: 'out.svg',
        layers: [],
      }),
    );
    const text = await readFile(join(dir, 'out.svg'), 'utf8');
    expect(text.startsWith('<?xml') || text.includes('<svg')).toBe(true);
    expect(text).toContain('data:image/png;base64,');
  });

  it('rejects unsupported output extension', async () => {
    const dir = await tmpWorkspace();
    await expect(
      processImage(
        dir,
        pixeltxtConfigSchema.parse({
          base: 'in.png',
          output: 'out.bmp',
          layers: [],
        }),
      ),
    ).rejects.toThrow(/Unsupported output extension/);
  });

  it('rejects missing base image', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-missing-'));
    dirs.push(dir);
    await expect(
      processImage(
        dir,
        pixeltxtConfigSchema.parse({
          base: 'nope.png',
          output: 'out.png',
          layers: [],
        }),
      ),
    ).rejects.toThrow();
  });

  it('produces different output for two layers vs one', async () => {
    const dir = await tmpWorkspace();
    const one = pixeltxtConfigSchema.parse({
      base: 'in.png',
      output: 'one.png',
      layers: [{ type: 'text', text: 'A', x: 10, y: 60, fontSize: 40, color: '#ffffff' }],
    });
    const two = pixeltxtConfigSchema.parse({
      base: 'in.png',
      output: 'two.png',
      layers: [
        { type: 'text', text: 'A', x: 10, y: 60, fontSize: 40, color: '#ffffff' },
        { type: 'text', text: 'B', x: 100, y: 60, fontSize: 40, color: '#ff0000' },
      ],
    });
    await processImage(dir, one);
    await processImage(dir, two);
    const buf1 = await readFile(join(dir, 'one.png'));
    const buf2 = await readFile(join(dir, 'two.png'));
    expect(createHash('sha256').update(buf1).digest('hex')).not.toBe(
      createHash('sha256').update(buf2).digest('hex'),
    );
  });
});
