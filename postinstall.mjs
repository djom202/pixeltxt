#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

/**
 * Postinstall script to fix PATH issues after global npm install.
 * Automatically adds npm global bin directory to shell PATH if needed.
 */
function main() {
  // Check if this is a global installation
  const packageJsonPath = join(process.cwd(), 'package.json');
  if (!existsSync(packageJsonPath)) {
    // Not installing from a package directory, skip
    return;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const packageName = packageJson.name;

  // Get npm global prefix
  const npmPrefix = execSync('npm config get prefix', { encoding: 'utf8' }).trim();
  const globalBinDir = join(npmPrefix, 'bin');

  // Check if the binary is already in PATH
  const pathEnv = process.env.PATH || '';
  const pathDirs = pathEnv.split(':').filter(Boolean);

  if (pathDirs.includes(globalBinDir)) {
    console.log(`✓ ${packageName} is already in PATH`);
    return;
  }

  // Detect shell and config file
  const shell = process.env.SHELL || '';
  const homeDir = homedir();
  let configFile = null;
  let shellName = '';

  if (shell.includes('zsh')) {
    configFile = join(homeDir, '.zshrc');
    shellName = 'zsh';
  } else if (shell.includes('bash')) {
    configFile = join(homeDir, '.bashrc');
    shellName = 'bash';
  } else if (shell.includes('fish')) {
    configFile = join(homeDir, '.config', 'fish', 'config.fish');
    shellName = 'fish';
  } else {
    // Default to bash for unknown shells
    configFile = join(homeDir, '.bashrc');
    shellName = 'bash (default)';
  }

  // Check if already in config file
  let configContent = '';
  if (existsSync(configFile)) {
    configContent = readFileSync(configFile, 'utf8');
    if (configContent.includes(globalBinDir)) {
      console.log(`✓ ${globalBinDir} already in ${configFile}`);
      return;
    }
  }

  // Add to PATH
  let newLine = '';
  if (shell.includes('fish')) {
    newLine = `set -gx PATH ${globalBinDir} $PATH\n`;
  } else {
    newLine = `export PATH="${globalBinDir}:$PATH"\n`;
  }

  try {
    if (!existsSync(configFile)) {
      // Create directory if needed
      const dir = configFile.split('/').slice(0, -1).join('/');
      execSync(`mkdir -p "${dir}"`, { stdio: 'ignore' });
    }
    writeFileSync(configFile, configContent + newLine, { flag: 'a' });
    console.log(`✓ Added ${globalBinDir} to PATH in ${configFile}`);
    console.log(`\nTo use ${packageName} immediately, run:`);
    if (shell.includes('fish')) {
      console.log(`  source ${configFile}`);
    } else {
      console.log(`  source ${configFile}`);
    }
    console.log(`\nOr restart your terminal.`);
  } catch (err) {
    console.error(`⚠ Failed to update ${configFile}: ${err.message}`);
    console.log(`\nPlease manually add this line to your ${shellName} config:`);
    console.log(`  export PATH="${globalBinDir}:$PATH"`);
  }
}

main();
