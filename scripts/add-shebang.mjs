import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)));
const cliPath = join(root, 'dist', 'cli.js');
const content = readFileSync(cliPath, 'utf8');
if (!content.startsWith('#!/usr/bin/env node\n')) {
  writeFileSync(cliPath, `#!/usr/bin/env node\n${content}`);
}
