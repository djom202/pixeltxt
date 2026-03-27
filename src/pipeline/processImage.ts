import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import sharp from 'sharp';
import type { PixeltxtConfig } from '../config/schema.js';
import { buildTextOverlaySvg } from './svgText.js';

export type OutputFormat = 'jpeg' | 'png' | 'webp' | 'svg';

export function formatFromOutputPath(outputPath: string): OutputFormat {
  const lower = outputPath.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'jpeg';
  if (lower.endsWith('.png')) return 'png';
  if (lower.endsWith('.webp')) return 'webp';
  if (lower.endsWith('.svg')) return 'svg';
  throw new Error(
    `Unsupported output extension for "${outputPath}". Use .jpg, .jpeg, .png, .webp, or .svg.`,
  );
}

/**
 * Raster outputs are produced by Sharp. For `.svg` output, embeds the final raster as base64
 * inside a minimal SVG wrapper so the file remains valid SVG for tooling that expects it.
 */
export async function processImage(cwd: string, config: PixeltxtConfig): Promise<void> {
  const basePath = resolve(cwd, config.base);
  const outputPath = resolve(cwd, config.output);
  const format = formatFromOutputPath(outputPath);

  let pipeline = sharp(basePath);
  const meta = await pipeline.metadata();
  const width = meta.width;
  const height = meta.height;

  if (width === undefined || height === undefined) {
    throw new Error(`Could not read dimensions for base image: ${basePath}`);
  }

  const composites: sharp.OverlayOptions[] = [];

  for (const layer of config.layers) {
    const svgBuffer = buildTextOverlaySvg(width, height, layer);
    const overlay = await sharp(svgBuffer).ensureAlpha().png().toBuffer();
    composites.push({ input: overlay, left: 0, top: 0 });
  }

  if (composites.length > 0) {
    pipeline = pipeline.composite(composites);
  }

  if (format === 'svg') {
    const buffer = await pipeline.png().toBuffer();
    const b64 = buffer.toString('base64');
    const w = String(width);
    const h = String(height);
    const svgOut = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <image width="${w}" height="${h}" xlink:href="data:image/png;base64,${b64}" />
</svg>`;
    await writeFile(outputPath, svgOut, 'utf8');
    return;
  }

  let sharpOut: sharp.Sharp = pipeline;
  if (format === 'jpeg') {
    sharpOut = pipeline.jpeg({ quality: 90, mozjpeg: true });
  } else if (format === 'webp') {
    sharpOut = pipeline.webp({ quality: 90 });
  } else {
    sharpOut = pipeline.png({ compressionLevel: 9 });
  }

  await sharpOut.toFile(outputPath);
}
