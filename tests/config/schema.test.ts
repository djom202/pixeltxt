import { describe, expect, it } from 'vitest';
import { pixeltxtConfigSchema } from '../../src/config/schema.js';

describe('pixeltxtConfigSchema', () => {
  it('parses minimal valid config', () => {
    const parsed = pixeltxtConfigSchema.parse({
      base: './a.png',
      output: './b.png',
      layers: [],
    });
    expect(parsed.base).toBe('./a.png');
    expect(parsed.layers).toEqual([]);
  });

  it('defaults layers to empty array when omitted', () => {
    const parsed = pixeltxtConfigSchema.parse({
      base: './a.png',
      output: './b.png',
    });
    expect(parsed.layers).toEqual([]);
  });

  it('rejects empty base or output', () => {
    expect(() => pixeltxtConfigSchema.parse({ base: '', output: './o.png', layers: [] })).toThrow();
    expect(() => pixeltxtConfigSchema.parse({ base: './a.png', output: '', layers: [] })).toThrow();
  });

  it('applies defaults on text layers', () => {
    const parsed = pixeltxtConfigSchema.parse({
      base: './a.png',
      output: './b.png',
      layers: [{ type: 'text', text: 'Hi', x: 0, y: 0 }],
    });
    const layer = parsed.layers[0];
    expect(layer).toBeDefined();
    if (layer?.type !== 'text') throw new Error('expected text');
    expect(layer.fontSize).toBe(24);
    expect(layer.color).toBe('#ffffff');
    expect(layer.anchor).toBe('start');
  });

  it('accepts anchor middle and end', () => {
    const mid = pixeltxtConfigSchema.parse({
      base: './a.png',
      output: './b.png',
      layers: [{ type: 'text', text: 'M', x: 0, y: 0, anchor: 'middle' }],
    });
    expect(mid.layers[0]?.type === 'text' && mid.layers[0].anchor).toBe('middle');
    const end = pixeltxtConfigSchema.parse({
      base: './a.png',
      output: './b.png',
      layers: [{ type: 'text', text: 'E', x: 0, y: 0, anchor: 'end' }],
    });
    expect(end.layers[0]?.type === 'text' && end.layers[0].anchor).toBe('end');
  });

  it('accepts stroke and strokeWidth', () => {
    const parsed = pixeltxtConfigSchema.parse({
      base: './a.png',
      output: './b.png',
      layers: [
        {
          type: 'text',
          text: 'S',
          x: 0,
          y: 0,
          stroke: '#000000',
          strokeWidth: 2,
        },
      ],
    });
    const layer = parsed.layers[0];
    expect(layer?.type === 'text' && layer.stroke).toBe('#000000');
    expect(layer?.type === 'text' && layer.strokeWidth).toBe(2);
  });

  it('preserves multiline text as a single string', () => {
    const parsed = pixeltxtConfigSchema.parse({
      base: './a.png',
      output: './b.png',
      layers: [{ type: 'text', text: 'line1\nline2', x: 0, y: 0 }],
    });
    const layer = parsed.layers[0];
    expect(layer?.type === 'text' && layer.text).toBe('line1\nline2');
  });

  it('rejects non-positive fontSize', () => {
    expect(() =>
      pixeltxtConfigSchema.parse({
        base: './a.png',
        output: './b.png',
        layers: [{ type: 'text', text: 'Hi', x: 0, y: 0, fontSize: 0 }],
      }),
    ).toThrow();
    expect(() =>
      pixeltxtConfigSchema.parse({
        base: './a.png',
        output: './b.png',
        layers: [{ type: 'text', text: 'Hi', x: 0, y: 0, fontSize: -1 }],
      }),
    ).toThrow();
  });

  it('rejects invalid anchor', () => {
    expect(() =>
      pixeltxtConfigSchema.parse({
        base: './a.png',
        output: './b.png',
        layers: [
          {
            type: 'text',
            text: 'Hi',
            x: 0,
            y: 0,
            anchor: 'invalid',
          },
        ],
      }),
    ).toThrow();
  });
});
