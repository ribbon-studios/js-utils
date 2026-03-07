import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig(tseslint.configs.recommended, {
  plugins: {
    'unused-imports': unusedImports,
  },
  rules: {
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'unused-imports/no-unused-imports': 'error',
  },
});
