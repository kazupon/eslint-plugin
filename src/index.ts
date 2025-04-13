/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { URL } from 'node:url'
import { rules } from './rules/index.ts'
import { readPackageJson } from './utils/package.ts'

// import type { Linter } from '@typescript-eslint/utils/ts-eslint'
import type { ESLint, Linter as ESLinter } from 'eslint'

const pkg = readPackageJson(new URL('../package.json', import.meta.url))

export const plugin: ESLint.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  // @ts-expect-error -- TODO: we need to fix this, and `utils/rule.ts` too!
  rules
}

const commentConfig: ESLinter.Config[] = [
  {
    name: '@kazupon/eslint-plugin/comment',
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    ignores: ['**/*.md', '**/*.md/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: {
      '@kazupon': plugin
    },
    rules: {
      // TODO: we should rename namespace with helper function
      '@kazupon/enforce-header-comment': 'error'
    }
  }
]

export const configs: ESLint.Plugin['configs'] = {
  recommended: [...commentConfig],
  comment: commentConfig
} satisfies ESLint.Plugin['configs']

plugin.configs = configs

/** @alias */
export default plugin
