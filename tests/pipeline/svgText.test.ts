import { describe, expect, it } from 'vitest';
import { pixeltxtConfigSchema } from '../../src/config/schema.js';
import { buildTextOverlaySvg } from '../../src/pipeline/svgText.js';

function textLayerFrom(partial: { text: string } & Record<string, unknown>) {
  const parsed = pixeltxtConfigSchema.parse({
    base: './x.png',
    output: './y.png',
    layers: [{ type: 'text', x: 10, y: 20, ...partial }],
  });
  const layer = parsed.layers[0];
  if (layer?.type !== 'text') throw new Error('expected text layer');
  return layer;
}

describe('buildTextOverlaySvg', () => {
  it('escapes XML special characters in text', () => {
    const layer = textLayerFrom({ text: `A & B < C > D "E" F'G` });
    const svg = buildTextOverlaySvg(100, 50, layer).toString('utf8');
    expect(svg).toContain('&amp;');
    expect(svg).toContain('&lt;');
    expect(svg).toContain('&gt;');
    expect(svg).toContain('&quot;');
    expect(svg).toContain('&apos;');
    expect(svg).not.toContain('A & B');
  });

  it('renders multiline text as multiple tspans', () => {
    const layer = textLayerFrom({ text: 'first\nsecond' });
    const svg = buildTextOverlaySvg(200, 100, layer).toString('utf8');
    expect(svg.match(/<tspan/g)?.length).toBe(2);
    expect(svg).toContain('first');
    expect(svg).toContain('second');
  });

  it('includes stroke attributes when stroke and strokeWidth are set', () => {
    const layer = textLayerFrom({
      text: 'X',
      stroke: '#ff0000',
      strokeWidth: 3,
    });
    const svg = buildTextOverlaySvg(80, 40, layer).toString('utf8');
    expect(svg).toContain('stroke="#ff0000"');
    expect(svg).toContain('stroke-width="3"');
  });

  it('embeds @font-face when fontPath is set', () => {
    const layer = textLayerFrom({
      text: 'Z',
      fontPath: 'C:\\fonts\\Custom.ttf',
    });
    const svg = buildTextOverlaySvg(60, 30, layer).toString('utf8');
    expect(svg).toContain('@font-face');
    expect(svg).toContain('C:/fonts/Custom.ttf');
    expect(svg).toContain('PixeltxtFont');
  });
});
