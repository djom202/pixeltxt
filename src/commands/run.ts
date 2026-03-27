import { resolve } from 'node:path';
import { loadConfigFile, resolveConfigPath } from '../config/loader.js';
import { processImage } from '../pipeline/processImage.js';

export interface RunOptions {
  cwd: string;
  config?: string;
}

export async function runCommand(options: RunOptions): Promise<void> {
  const cwd = resolve(options.cwd);
  const { path: configPath, format } = resolveConfigPath(cwd, options.config);
  const config = loadConfigFile(configPath, format);
  await processImage(cwd, config);
  console.log(`Wrote ${resolve(cwd, config.output)}`);
}
