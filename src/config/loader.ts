import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';
import { pixeltxtConfigSchema, type PixeltxtConfig } from './schema.js';

export const DEFAULT_CONFIG_FILENAMES = ['pixeltxt.yaml', 'pixeltxt.yml', 'pixeltxt.json'] as const;

function parseConfigContent(raw: string, format: 'json' | 'yaml'): unknown {
  if (format === 'json') {
    return JSON.parse(raw);
  }
  return yaml.load(raw);
}

export function detectFormatFromPath(filePath: string): 'json' | 'yaml' {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.json')) return 'json';
  return 'yaml';
}

export function loadConfigFile(absolutePath: string, format: 'json' | 'yaml'): PixeltxtConfig {
  const raw = readFileSync(absolutePath, 'utf8');
  const data = parseConfigContent(raw, format);
  return pixeltxtConfigSchema.parse(data);
}

export function resolveConfigPath(
  cwd: string,
  explicitPath?: string,
): { path: string; format: 'json' | 'yaml' } {
  if (explicitPath) {
    const path = resolve(cwd, explicitPath);
    return { path, format: detectFormatFromPath(path) };
  }

  for (const name of DEFAULT_CONFIG_FILENAMES) {
    const path = resolve(cwd, name);
    if (existsSync(path)) {
      return { path, format: detectFormatFromPath(path) };
    }
  }

  throw new Error(
    `No configuration file found in ${cwd}. Expected one of: ${DEFAULT_CONFIG_FILENAMES.join(', ')}`,
  );
}
