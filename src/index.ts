import { URL } from 'node:url'
import { rules } from './rules/index.ts'
import { readPackageJson } from './utils/package.ts'

import type { ClassicConfig, Linter } from '@typescript-eslint/utils/ts-eslint'

const pkg = readPackageJson(new URL('package.json', import.meta.url))

// TODO: some config for categories

export const configs: Record<string, ClassicConfig.Config> = {
  // recommended: [
  //   // TODO: add recommended rules
  // ]
}

export const plugin: Linter.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version
  },
  configs,
  rules
}

/** @alias */
export default plugin
