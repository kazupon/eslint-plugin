/**
 * This script is inspired from tools script of `eslint-plugin-module-interop`
 * @see https://github.com/ota-meshi/eslint-plugin-module-interop/tree/main/tools/render-rules.ts
 *
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { loadRules } from './load-rules.ts'

import type { RuleModule } from '../src/utils/types.ts'

const DEFAULT_RESOLVE_RULE_PATH = (ruleName: string) => `./${ruleName}.md`

interface RenderRulesTableContentParams {
  /**
   * The level of the category in the table. For example, if you want to render a table under a heading like "## Category", set this to 2.
   */
  categoryLevel: number
  /**
   * The plugin name to be displayed in the title of the rules table.
   */
  pluginName: string
  /**
   * The root path of the rules directory. This is where the rules are loaded from.
   */
  rulesRootPath: string
  /**
   * The namespace of the rules. This is used to construct the rule IDs.
   */
  namespace?: string
  /**
   * Resolve the path for the rule. This is used to create links to the rule documentation.
   * @param ruleName The name of the rule to resolve the path for.
   * @returns A resolved path for the rule.
   */
  resolveRulePath?: (ruleName: string) => string
}

/**
 * Render the rules table content for the documentation.
 * @param params {@link RenderRulesTableContentParams | A parameters } for rendering rules table content
 * @returns A rendered string containing the rules table.
 */
export async function renderRulesTableContent(
  params: RenderRulesTableContentParams
): Promise<string> {
  const {
    categoryLevel,
    rulesRootPath,
    pluginName,
    namespace = '',
    resolveRulePath = DEFAULT_RESOLVE_RULE_PATH
  } = params

  const rules = await loadRules(rulesRootPath, namespace)
  const pluginRules = rules.filter(rule => !rule.meta?.deprecated)
  const deprecatedRules = rules.filter(rule => rule.meta?.deprecated)

  function toRuleRow(rule: RuleModule) {
    const fixableMark = rule.meta?.fixable ? '🔧' : ''
    const recommendedMark = rule.meta?.docs?.recommended ? '⭐' : ''
    const category = rule.meta?.docs?.category || ''
    const link = `[${rule.meta?.docs?.ruleId}](${resolveRulePath(rule.meta?.docs?.ruleName || '')})`
    const description = rule.meta?.docs?.description || '(no description)'
    return `| ${link} | ${description} | ${category} | ${fixableMark} | ${recommendedMark} |`
  }

  function toDeprecatedRuleRow(rule: RuleModule) {
    const link = `[${rule.meta?.docs?.ruleId}](${resolveRulePath(rule.meta?.docs?.ruleName || '')})`
    const replacedRules = rule.meta?.replacedBy || []
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const resolveRuleId = (name: string) => {
      return namespace ? `${namespace}/${name}` : name
    }
    const replacedBy = replacedRules
      .map(name => `[${resolveRuleId(name)}](${resolveRulePath(name)}.md)`)
      .join(', ')

    return `| ${link} | ${replacedBy || '(no replacement)'} |`
  }

  let rulesTableContent = `
#${'#'.repeat(categoryLevel)} ${pluginName} Rules

| Rule ID | Description | Category | Fixable | RECOMMENDED |
|:--------|:------------|:---------|:-------:|:-----------:|
${pluginRules.map(toRuleRow).join('\n')}
`

  if (deprecatedRules.length > 0) {
    rulesTableContent += `
## Deprecated

- ⚠️ We're going to remove deprecated rules in the next major release. Please migrate to successor/new rules.
- 😇 We don't fix bugs which are in deprecated rules since we don't have enough resources.

| Rule ID | Replaced by |
|:--------|:------------|
${deprecatedRules.map(toDeprecatedRuleRow).join('\n')}
`
  }
  return rulesTableContent
}
