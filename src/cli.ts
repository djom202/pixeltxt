#!/usr/bin/env node
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command, Option } from 'commander';
import { runCommand } from './commands/run.js';

const VERSION = '0.1.0';

const program = new Command();

/** Same exit path as Commander’s built-in `.version()` (stdout + `commander.version` / process.exit). */
function printVersionAndExit(cmd: Command): never {
  const cfg = cmd.configureOutput();
  if (cfg.writeOut) {
    cfg.writeOut(`${VERSION}\n`);
  } else {
    process.stdout.write(`${VERSION}\n`);
  }
  const withExit = cmd as Command & {
    _exit(exitCode: number, code: string, message: string): never;
  };
  return withExit._exit(0, 'commander.version', VERSION);
}

program
  .name('pixeltxt')
  .description('Automate image personalization with text and layer overlays')
  .version(VERSION, '-v, --version');

program.addOption(new Option('-V', 'output the version number').hideHelp());
program.on('option:V', () => {
  printVersionAndExit(program);
});

program
  .command('run')
  .description(
    'Process the base image using pixeltxt.yaml, pixeltxt.yml, or pixeltxt.json in the working directory',
  )
  .option('-c, --config <file>', 'Path to config file (JSON or YAML)')
  .option('--cwd <dir>', 'Working directory for paths in config', process.cwd())
  .action(async (opts: { config?: string; cwd: string }) => {
    try {
      await runCommand({ cwd: opts.cwd, config: opts.config });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`pixeltxt: ${message}`);
      process.exitCode = 1;
    }
  });

const entryScript = process.argv[1] ? resolve(process.argv[1]) : '';
const thisFile = fileURLToPath(import.meta.url);
const invokedAsMain = entryScript === thisFile;

/** Parse argv like `process.argv` (use `{ from: 'node' }` via Commander). For tests and tooling. */
export async function runPixeltxtCli(argv: string[]): Promise<void> {
  await program.parseAsync(argv, { from: 'node' });
}

if (invokedAsMain) {
  void runPixeltxtCli(process.argv);
}

export { program };
