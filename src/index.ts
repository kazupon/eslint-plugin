/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { rules } from './rules/index.ts'
import {
  NAME,
  NAMESPACE,
  VERSION,
  GLOB_FILES,
  GLOB_CONFIG_FILES,
  TEST_GLOB_FILES,
  TEST_DTS_GLOB_FILES,
  GLOB_MARKDOWN,
  GLOB_MARKDOWN_CODES
} from './utils/constants.ts'
import { enforceHeaderCommentRuleOnly, baseRules, resolveConfigNmae } from './utils/config.ts'

import type { ESLint, Linter } from 'eslint'

type PluginConfigs = {
  recommended: Linter.Config<Linter.RulesRecord>[]
  comment: Linter.Config<Linter.RulesRecord>[]
}

// eslint-disable-next-line jsdoc/require-jsdoc -- NOTE(kazupon): Complexity of typing
export const plugin: Omit<ESLint.Plugin, 'configs'> & { configs: PluginConfigs } = {
  meta: {
    name: NAME,
    version: VERSION
  },
  rules,
  configs: {} as PluginConfigs
}

export const baseIgnores: string[] = [GLOB_MARKDOWN, GLOB_MARKDOWN_CODES]
export const enforceHeaderCommentIgnores: string[] = [
  ...baseIgnores,
  GLOB_CONFIG_FILES,
  TEST_GLOB_FILES,
  TEST_DTS_GLOB_FILES
]

const baseConfig: Linter.Config = {
  files: [GLOB_FILES],
  plugins: {
    [NAMESPACE]: plugin
  }
}

const recommendedConfig: Linter.Config[] = [
  {
    ...baseConfig,
    name: resolveConfigNmae('recommended/base'),
    ignores: baseIgnores,
    rules: baseRules
  },
  {
    ...baseConfig,
    name: resolveConfigNmae('recommended/enforce-header-comment'),
    ignores: enforceHeaderCommentIgnores,
    rules: enforceHeaderCommentRuleOnly
  }
]

// NOTE(kazupon): for the future, we might add more configs tweaking as comment config
const commentConfig: Linter.Config[] = recommendedConfig

/**
 * Plugin Configurations.
 */
export const configs: {
  /**
   * Recommended configuration
   */
  recommended: typeof recommendedConfig
  /**
   * Comment configuration
   */
  comment: typeof commentConfig
} = {
  recommended: recommendedConfig,
  comment: commentConfig
}

plugin.configs = configs

// eslint-disable-next-line jsdoc/valid-types -- NOTE(kazupon): `@alias` directive is knip specific
/** @alias */
export default plugin

export { defaultOptions } from './rules/index.ts'
