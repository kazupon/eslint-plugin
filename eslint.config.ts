// eslint-disable-next-line @kazupon/enforce-header-comment

import {
  comments,
  defineConfig,
  imports,
  javascript,
  jsonc,
  markdown,
  prettier,
  promise,
  typescript,
  unicorn,
  vitest,
  yaml
} from '@kazupon/eslint-config'
import { globalIgnores } from 'eslint/config'
import { plugin } from './src/index.ts'

const config: ReturnType<typeof defineConfig> = defineConfig(
  javascript(),
  imports({
    typescript: true,
    rules: {
      'import/extensions': ['error', 'always', { ignorePackages: true }]
    }
  }),
  comments(),
  promise(),
  unicorn({
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/prevent-abbreviations': 'off'
    }
  }),
  typescript({
    parserOptions: {
      tsconfigRootDir: import.meta.dirname
    }
  }),
  jsonc({
    json: true,
    json5: true,
    jsonc: true,
    prettier: true
  }),
  yaml({
    prettier: true
  }),
  // @ts-expect-error -- FIXME
  ...plugin.configs.recommended,
  markdown({
    rules: {
      'import/extensions': 'off',
      'import/no-named-as-default-member': 'off',
      'unused-imports/no-unused-imports': 'off',
      'unicorn/filename-case': 'off'
    }
  }),
  vitest(),
  prettier(),
  // @ts-expect-error -- FIXME
  globalIgnores([
    '.vscode',
    '**/lib/**',
    'lib',
    '**/dist/**',
    'docs/.vitepress/cache',
    'tsconfig.json',
    'pnpm-lock.yaml'
  ])
)

export default config
