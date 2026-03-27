import { z } from 'zod';

const textLayerSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
  x: z.number(),
  y: z.number(),
  fontSize: z.number().positive().optional().default(24),
  color: z.string().optional().default('#ffffff'),
  /** Optional path to a TTF/OTF file for reliable rendering in headless environments */
  fontPath: z.string().optional(),
  /** CSS font-family name; used when fontPath is not set (system fonts, best-effort) */
  fontFamily: z.string().optional().default('sans-serif'),
  /** Text anchor: start | middle | end (SVG semantics) */
  anchor: z.enum(['start', 'middle', 'end']).optional().default('start'),
  /** Optional stroke around glyphs */
  stroke: z.string().optional(),
  strokeWidth: z.number().nonnegative().optional().default(0),
});

export const pixeltxtConfigSchema = z.object({
  base: z.string().min(1, 'base image path is required'),
  output: z.string().min(1, 'output path is required'),
  layers: z.array(textLayerSchema).default([]),
});

export type PixeltxtConfig = z.infer<typeof pixeltxtConfigSchema>;
export type TextLayer = z.infer<typeof textLayerSchema>;
