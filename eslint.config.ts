import {
  comments,
  defineConfig,
  jsdoc,
  jsonc,
  markdown,
  regexp,
  typescript,
  oxlint,
  vitest,
  yaml
} from '@kazupon/eslint-config'

const config: ReturnType<typeof defineConfig> = defineConfig(
  comments({
    kazupon: {
      ignores: ['./**/test/**', './**/src/**/*.test.ts', './**/src/**/*.test-d.ts']
    }
  }),
  jsdoc({
    typescript: 'syntax',
    ignores: ['docs/.vitepress/config.ts']
  }),
  regexp(),
  typescript({
    parserOptions: {
      tsconfigRootDir: import.meta.dirname,
      project: true
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
  markdown({
    rules: {
      // @ts-expect-error -- ignore for eslint
      'import/extensions': 'off',
      'import/no-named-as-default-member': 'off',
      'unused-imports/no-unused-imports': 'off',
      'unicorn/filename-case': 'off'
    }
  }),
  vitest(),
  oxlint({
    presets: ['typescript'],
    configFile: './.oxlintrc.json'
  })
)

export default config
