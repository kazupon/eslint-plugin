import { URL } from 'node:url'
import { rules } from './rules/index.ts'
import { readPackageJson } from './utils/package.ts'

import type { ESLint } from 'eslint'

const pkg = readPackageJson(new URL('package.json', import.meta.url))

export const plugin: ESLint.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  rules
}

// TODO: some config for categories

export const configs: ESLint.Plugin['configs'] = {
  recommended: [
    // TODO: add recommended rules
  ]
}

plugin.configs = configs

/** @alias */
export default plugin
