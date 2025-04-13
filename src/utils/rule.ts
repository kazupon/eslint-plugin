/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import type {
  RuleListener,
  RuleWithMeta,
  RuleWithMetaAndName
} from '@typescript-eslint/utils/eslint-utils'
import type { RuleContext, RuleModule } from '@typescript-eslint/utils/ts-eslint'
import type { Rule } from 'eslint'

const blobUrl = 'https://github.com/kazupon/eslint-plugin/tree/main/src/rules/'

type CreateNamedRule<PluginDocs = unknown> = <
  Options extends readonly unknown[],
  MessageIds extends string
>(
  options: Readonly<RuleWithMetaAndName<Options, MessageIds, PluginDocs>>
) => RuleModule<MessageIds, Options, PluginDocs>

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator<PluginDocs = unknown>(
  urlCreator: (ruleName: string) => string
): CreateNamedRule<PluginDocs> {
  return function createNamedRule<Options extends readonly unknown[], MessageIds extends string>({
    meta,
    name,
    ...rule
  }: Readonly<RuleWithMetaAndName<Options, MessageIds, PluginDocs>>): RuleModule<
    MessageIds,
    Options,
    PluginDocs
  > {
    return _createRule<Options, MessageIds, PluginDocs>({
      meta: {
        ...meta,
        docs: {
          ...meta.docs,
          url: urlCreator(name)
        }
      },
      ...rule
    })
  }
}

function _createRule<
  Options extends readonly unknown[],
  MessageIds extends string,
  PluginDocs = unknown
>({
  create,
  defaultOptions,
  meta
}: Readonly<RuleWithMeta<Options, MessageIds, PluginDocs>>): RuleModule<
  MessageIds,
  Options,
  PluginDocs
> {
  return {
    create: ((context: Readonly<RuleContext<MessageIds, Options>>): RuleListener => {
      const optionsWithDefault = context.options.map((options, index) => {
        return {
          ...(defaultOptions[index] as Record<string, unknown>),
          ...(options as Record<string, unknown>)
        }
      }) as unknown as Options
      return create(context, optionsWithDefault)
    }) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultOptions,
    meta: meta as any // eslint-disable-line @typescript-eslint/no-explicit-any
  }
}

type RuleMetaData = NonNullable<Rule.RuleMetaData['docs']>
type RestRuleMetaData = Pick<RuleMetaData, 'category' | 'recommended'>

export const createRule: ReturnType<typeof RuleCreator<RestRuleMetaData>> =
  RuleCreator<RestRuleMetaData>(ruleName => {
    const ns = ruleName.split('-')[0]
    return `${blobUrl}${ns}/${ruleName}.ts`
  })
