import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.tests.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    plugins: {
      'import-x': importX,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'vitest.config.ts',
      'vitest.golden.config.ts',
      'eslint.config.js',
      'prettier.config.cjs',
      'commitlint.config.mjs',
      'scripts/**',
    ],
  },
);
