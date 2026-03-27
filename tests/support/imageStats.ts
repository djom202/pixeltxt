import sharp from 'sharp';

export interface ImageRegion {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface RgbLumaStats {
  meanLuma: number;
  maxLuma: number;
  minLuma: number;
  meanR: number;
  meanG: number;
  meanB: number;
}

function luma(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * RGB + luminance statistics for a rectangular region (for visual regression assertions).
 */
export async function readRgbLumaStats(
  imageBuffer: Buffer,
  region: ImageRegion,
): Promise<RgbLumaStats> {
  const { data, info } = await sharp(imageBuffer)
    .extract(region)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const channels = info.channels;
  const stride = channels;
  const pixels = data.length / stride;

  let sumL = 0;
  let maxL = 0;
  let minL = 255;
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;

  for (let i = 0; i < data.length; i += stride) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const L = luma(r, g, b);
    sumL += L;
    maxL = Math.max(maxL, L);
    minL = Math.min(minL, L);
    sumR += r;
    sumG += g;
    sumB += b;
  }

  const n = Math.max(1, pixels);
  return {
    meanLuma: sumL / n,
    maxLuma: maxL,
    minLuma: minL,
    meanR: sumR / n,
    meanG: sumG / n,
    meanB: sumB / n,
  };
}
