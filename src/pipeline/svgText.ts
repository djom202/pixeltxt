import type { TextLayer } from '../config/schema.js';

function escapeXml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/**
 * Builds an SVG overlay the size of the base image so text coordinates match pixel space.
 */
export function buildTextOverlaySvg(width: number, height: number, layer: TextLayer): Buffer {
  const lines = layer.text.split('\n');
  const lineHeight = Math.round(layer.fontSize * 1.2);
  const escapedLines = lines.map((line) => escapeXml(line));

  const fontFace =
    layer.fontPath !== undefined
      ? `@font-face { font-family: 'PixeltxtFont'; src: url('file://${layer.fontPath.replace(/\\/g, '/')}'); }`
      : '';

  const family = layer.fontPath !== undefined ? 'PixeltxtFont' : escapeXml(layer.fontFamily);

  const strokeAttrs =
    layer.stroke !== undefined && layer.strokeWidth > 0
      ? `stroke="${escapeXml(layer.stroke)}" stroke-width="${String(layer.strokeWidth)}" paint-order="stroke fill"`
      : '';

  const tspans = escapedLines
    .map(
      (line, i) =>
        `<tspan x="${String(layer.x)}" dy="${String(i === 0 ? 0 : lineHeight)}">${line}</tspan>`,
    )
    .join('');

  const textEl = `<text x="${String(layer.x)}" y="${String(layer.y)}" font-size="${String(layer.fontSize)}" fill="${escapeXml(layer.color)}" font-family="${family}" text-anchor="${layer.anchor}" dominant-baseline="alphabetic" ${strokeAttrs}>${tspans}</text>`;

  const w = String(width);
  const h = String(height);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><style type="text/css"><![CDATA[
    ${fontFace}
  ]]></style></defs>
  ${textEl}
</svg>`;

  return Buffer.from(svg, 'utf8');
}
