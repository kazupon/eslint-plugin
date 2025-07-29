/**
 * This file is exntended from the original ESLint typings for plugin
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import type { RuleDefinition } from '@eslint/core'
import type { Linter, Rule } from 'eslint'

declare module '@eslint/core' {
  /**
   * Extends the `RuleMetaData` interface for plugin authors to add custom properties.
   */
  export interface RulesMetaDocs {
    /**
     * The id of the rule. (e.g `@typescript-eslint/explicit-module-boundary-types`)
     */
    ruleId?: string | undefined
    /**
     * The name of the rule. (e.g `explicit-module-boundary-types`)
     */
    ruleName?: string | undefined
    /**
     * The default severity of the rule. (e.g `error`, `warn`, `off`)
     */
    defaultSeverity?: Linter.StringSeverity | undefined
  }
  /**
   * Extends the `RuleMetaData` interface for plugin authors to add custom properties.
   */
  export interface RuleDefinition {
    /**
     * The name of rule. (e.g `@typescript-eslint/explicit-module-boundary-types`)
     */
    name: string
  }
}

/**
 * NOTE(kazupon):
 * The current `RuleDefinition` is inferred by the `SourceCode` of `@eslint/core` whose type parameter is the context passed to create.
 * We want to use interfaces of `SourceCode` of `eslint`, so we redefine it so that we can use them.
 */
export type RuleCreateOptions = Omit<RuleDefinition, 'create'> & Pick<Rule.RuleModule, 'create'>

/**
 * NOTE(kazupon):
 * Currently, `RuleModule` does not infer the type `meta` defined in `eslint` even if you extend `RulesMetaDocs` using `declare module`.
 * So, we can override it by inheriting from an existing `RuleModule` and defining your own `meta`.
 */
export interface RuleModule extends Rule.RuleModule {
  meta: RuleDefinition['meta'] // extend from `RuleDefinition`
  create(context: Rule.RuleContext): Rule.RuleListener
}

type SourceCode = Rule.RuleContext['sourceCode']

export type Comment = ReturnType<SourceCode['getAllComments']>[number]
