import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_CONFIG_FILENAMES,
  detectFormatFromPath,
  loadConfigFile,
  resolveConfigPath,
} from '../../src/config/loader.js';

describe('detectFormatFromPath', () => {
  it('returns json for .json extension', () => {
    expect(detectFormatFromPath('/x/config.json')).toBe('json');
    expect(detectFormatFromPath('C:\\proj\\pixeltxt.JSON')).toBe('json');
  });

  it('returns yaml for .yaml, .yml, and other extensions', () => {
    expect(detectFormatFromPath('/a/pixeltxt.yaml')).toBe('yaml');
    expect(detectFormatFromPath('/a/pixeltxt.yml')).toBe('yaml');
    expect(detectFormatFromPath('/a/pixeltxt.YAML')).toBe('yaml');
    expect(detectFormatFromPath('/a/custom.txt')).toBe('yaml');
  });
});

describe('resolveConfigPath', () => {
  const dirs: string[] = [];

  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  async function makeTmp(): Promise<string> {
    const d = await mkdtemp(join(tmpdir(), 'pixeltxt-loader-'));
    dirs.push(d);
    return d;
  }

  it('throws when no default config exists', async () => {
    const cwd = await makeTmp();
    expect(() => resolveConfigPath(cwd)).toThrow(
      `No configuration file found in ${cwd}. Expected one of: ${DEFAULT_CONFIG_FILENAMES.join(', ')}`,
    );
  });

  it('resolves explicit path relative to cwd', async () => {
    const cwd = await makeTmp();
    const name = 'custom.yaml';
    await writeFile(
      join(cwd, name),
      `base: ./b.png
output: ./o.png
layers: []
`,
      'utf8',
    );
    const r = resolveConfigPath(cwd, name);
    expect(r.path).toBe(resolve(cwd, name));
    expect(r.format).toBe('yaml');
  });

  it('prefers pixeltxt.yaml over pixeltxt.yml and pixeltxt.json', async () => {
    const cwd = await makeTmp();
    await writeFile(
      join(cwd, 'pixeltxt.json'),
      JSON.stringify({ base: './a.png', output: './b.png', layers: [] }),
      'utf8',
    );
    await writeFile(
      join(cwd, 'pixeltxt.yml'),
      'base: ./a.png\noutput: ./b.png\nlayers: []\n',
      'utf8',
    );
    await writeFile(
      join(cwd, 'pixeltxt.yaml'),
      'base: ./from-yaml.png\noutput: ./b.png\nlayers: []\n',
      'utf8',
    );
    const r = resolveConfigPath(cwd);
    expect(r.path).toBe(resolve(cwd, 'pixeltxt.yaml'));
    expect(r.format).toBe('yaml');
  });

  it('prefers pixeltxt.yml over pixeltxt.json when yaml is absent', async () => {
    const cwd = await makeTmp();
    await writeFile(
      join(cwd, 'pixeltxt.json'),
      JSON.stringify({ base: './from-json.png', output: './b.png', layers: [] }),
      'utf8',
    );
    await writeFile(
      join(cwd, 'pixeltxt.yml'),
      'base: ./from-yml.png\noutput: ./b.png\nlayers: []\n',
      'utf8',
    );
    const r = resolveConfigPath(cwd);
    expect(r.path).toBe(resolve(cwd, 'pixeltxt.yml'));
    expect(r.format).toBe('yaml');
  });

  it('uses pixeltxt.json when it is the only match', async () => {
    const cwd = await makeTmp();
    await writeFile(
      join(cwd, 'pixeltxt.json'),
      JSON.stringify({ base: './j.png', output: './o.png', layers: [] }),
      'utf8',
    );
    const r = resolveConfigPath(cwd);
    expect(r.path).toBe(resolve(cwd, 'pixeltxt.json'));
    expect(r.format).toBe('json');
  });
});

describe('loadConfigFile', () => {
  const dirs: string[] = [];

  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  async function writeTmp(name: string, body: string): Promise<string> {
    const d = await mkdtemp(join(tmpdir(), 'pixeltxt-load-'));
    dirs.push(d);
    const p = join(d, name);
    await writeFile(p, body, 'utf8');
    return p;
  }

  it('loads valid YAML', async () => {
    const p = await writeTmp(
      'c.yaml',
      `base: ./in.png
output: ./out.png
layers: []
`,
    );
    const cfg = loadConfigFile(p, 'yaml');
    expect(cfg.base).toBe('./in.png');
    expect(cfg.output).toBe('./out.png');
    expect(cfg.layers).toEqual([]);
  });

  it('loads valid JSON', async () => {
    const p = await writeTmp(
      'c.json',
      JSON.stringify({ base: './i.png', output: './o.png', layers: [] }),
    );
    const cfg = loadConfigFile(p, 'json');
    expect(cfg.base).toBe('./i.png');
  });

  it('throws on invalid JSON syntax', async () => {
    const p = await writeTmp('bad.json', '{ not json');
    expect(() => loadConfigFile(p, 'json')).toThrow();
  });

  it('throws when YAML parses but fails Zod', async () => {
    const p = await writeTmp('bad.yaml', 'base: ./a\n'); // missing output
    expect(() => loadConfigFile(p, 'yaml')).toThrow();
  });

  it('throws when parsed YAML is not an object', async () => {
    const p = await writeTmp('scalar.yaml', 'just a string');
    expect(() => loadConfigFile(p, 'yaml')).toThrow();
  });
});
