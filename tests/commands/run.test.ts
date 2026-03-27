import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import sharp from 'sharp';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runCommand } from '../../src/commands/run.js';

describe('runCommand', () => {
  const dirs: string[] = [];

  afterEach(async () => {
    vi.restoreAllMocks();
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  async function workspaceWithYaml(
    useCustomName: boolean,
  ): Promise<{ dir: string; configName: string }> {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-run-'));
    dirs.push(dir);
    await sharp({
      create: {
        width: 64,
        height: 32,
        channels: 3,
        background: '#333',
      },
    })
      .png()
      .toFile(join(dir, 'base.png'));

    const body = `base: ./base.png
output: ./done.png
layers:
  - type: text
    text: "Hi"
    x: 4
    y: 22
    fontSize: 14
    color: "#ffffff"
`;
    const configName = useCustomName ? 'custom.yaml' : 'pixeltxt.yaml';
    await writeFile(join(dir, configName), body, 'utf8');
    return { dir, configName };
  }

  it('loads default pixeltxt.yaml and writes output', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(vi.fn());
    const { dir } = await workspaceWithYaml(false);
    await runCommand({ cwd: dir });
    const outPath = join(dir, 'done.png');
    await expect(readFile(outPath)).resolves.toBeDefined();
    expect(log).toHaveBeenCalledWith(`Wrote ${resolve(dir, 'done.png')}`);
  });

  it('loads explicit config path', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(vi.fn());
    const { dir, configName } = await workspaceWithYaml(true);
    await runCommand({ cwd: dir, config: configName });
    await expect(readFile(join(dir, 'done.png'))).resolves.toBeDefined();
    expect(log).toHaveBeenCalledWith(`Wrote ${resolve(dir, 'done.png')}`);
  });

  it('loads pixeltxt.json when used as explicit config', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-run-json-'));
    dirs.push(dir);
    await sharp({
      create: { width: 32, height: 32, channels: 3, background: '#000' },
    })
      .png()
      .toFile(join(dir, 'b.png'));

    await writeFile(
      join(dir, 'cfg.json'),
      JSON.stringify({
        base: './b.png',
        output: './out.png',
        layers: [],
      }),
      'utf8',
    );

    await runCommand({ cwd: dir, config: 'cfg.json' });
    await expect(readFile(join(dir, 'out.png'))).resolves.toBeDefined();
  });
});
