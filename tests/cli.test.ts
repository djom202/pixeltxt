import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { program, runPixeltxtCli } from '../src/cli.js';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const distCli = join(repoRoot, 'dist', 'cli.js');

describe('runPixeltxtCli', () => {
  beforeEach(() => {
    process.exitCode = undefined;
    program.exitOverride();
  });

  it('throws version code for -V', async () => {
    await expect(runPixeltxtCli([process.execPath, 'cli.js', '-V'])).rejects.toMatchObject({
      code: 'commander.version',
    });
  });

  it('throws version code for -v', async () => {
    await expect(runPixeltxtCli([process.execPath, 'cli.js', '-v'])).rejects.toMatchObject({
      code: 'commander.version',
    });
  });

  it('throws helpDisplayed for root --help', async () => {
    await expect(runPixeltxtCli([process.execPath, 'cli.js', '--help'])).rejects.toMatchObject({
      code: 'commander.helpDisplayed',
    });
  });

  it('sets exitCode 1 when config is missing', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-cli-empty-'));
    try {
      await runPixeltxtCli([process.execPath, 'cli.js', 'run', '--cwd', dir]);
      expect(process.exitCode).toBe(1);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('runs successfully with pixeltxt.yaml', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-cli-ok-'));
    try {
      await sharp({
        create: { width: 48, height: 48, channels: 3, background: '#111' },
      })
        .png()
        .toFile(join(dir, 'in.png'));

      await writeFile(
        join(dir, 'pixeltxt.yaml'),
        `base: ./in.png
output: ./final.png
layers: []
`,
        'utf8',
      );

      await runPixeltxtCli([process.execPath, 'cli.js', 'run', '--cwd', dir]);
      expect(process.exitCode).not.toBe(1);
      await expect(readFile(join(dir, 'final.png'))).resolves.toBeDefined();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe('dist/cli.js subprocess', () => {
  const dirs: string[] = [];
  afterEach(async () => {
    await Promise.all(dirs.splice(0).map((d) => rm(d, { recursive: true, force: true })));
  });

  it.skipIf(!existsSync(distCli))('run --help exits 0 and shows options', () => {
    const r = spawnSync(process.execPath, [distCli, 'run', '--help'], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toContain('--cwd');
    expect(r.stdout).toContain('--config');
  });

  it.skipIf(!existsSync(distCli))('exits 0 and creates output', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-sub-'));
    dirs.push(dir);
    await sharp({
      create: { width: 40, height: 40, channels: 3, background: '#222' },
    })
      .png()
      .toFile(join(dir, 'base.png'));

    await writeFile(
      join(dir, 'pixeltxt.yaml'),
      `base: ./base.png
output: ./sub-out.png
layers: []
`,
      'utf8',
    );

    const r = spawnSync(process.execPath, [distCli, 'run', '--cwd', dir], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(0);
    expect(r.stderr).toBe('');
    await expect(readFile(join(dir, 'sub-out.png'))).resolves.toBeDefined();
  });

  it.skipIf(!existsSync(distCli))('exits 1 and prints pixeltxt: on error', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'pixeltxt-sub-bad-'));
    dirs.push(dir);
    const r = spawnSync(process.execPath, [distCli, 'run', '--cwd', dir], {
      encoding: 'utf8',
    });
    expect(r.status).toBe(1);
    expect(r.stderr).toMatch(/^pixeltxt:/);
  });
});
