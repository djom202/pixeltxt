import { pixeltxtConfigSchema, type PixeltxtConfig } from '../../src/config/schema.js';
import { TEST_FONT_WOFF2_PATH } from './paths.js';

/** Shared dimensions and layer for golden PNG generation and comparison. */
export const GOLDEN_IMAGE_WIDTH = 120;
export const GOLDEN_IMAGE_HEIGHT = 56;

export const GOLDEN_BACKGROUND = { r: 18, g: 22, b: 28 };

export function buildGoldenPixeltxtConfig(): PixeltxtConfig {
  return pixeltxtConfigSchema.parse({
    base: './base.png',
    output: './golden-out.png',
    layers: [
      {
        type: 'text',
        text: 'Px',
        x: 12,
        y: 44,
        fontSize: 28,
        color: '#f5f5f5',
        fontPath: TEST_FONT_WOFF2_PATH,
      },
    ],
  });
}
