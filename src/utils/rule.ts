/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import type { RuleCreateOptions, RuleModule } from './types.ts'

import { NAMESPACE as ruleNamespance } from './constants.ts'

const BLOB_URL = 'https://eslint-plugin.kazupon.dev/rules'

type CreateNamedRule = (options: RuleCreateOptions) => RuleModule

function RuleCreator(
  urlCreator: (ruleName: string) => string,
  namespace: string = ''
): CreateNamedRule {
  return function createNamedRule({
    meta,
    name,
    ...rule
  }: Readonly<RuleCreateOptions>): RuleModule {
    const ruleId = namespace ? `${namespace}/${name}` : name
    return {
      meta: {
        ...meta,
        docs: {
          ...meta?.docs,
          url: urlCreator(name),
          ruleName: name,
          ruleId
        }
      },
      ...rule
    }
  }
}

export const createRule: ReturnType<typeof RuleCreator> = RuleCreator(ruleName => {
  return `${BLOB_URL}/${ruleName}`
}, ruleNamespance)
