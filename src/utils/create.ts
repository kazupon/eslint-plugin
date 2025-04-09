import type {
  RuleListener,
  RuleWithMeta,
  RuleWithMetaAndName
} from '@typescript-eslint/utils/eslint-utils'
import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'
import type { Rule } from 'eslint'

const blobUrl = 'https://github.com/kazupon/eslint-plugin/tree/main/src/rules/'

type RuleModule<T extends readonly unknown[]> = Rule.RuleModule & {
  defaultOptions: T
}

/**
 * Creates reusable function to create rules with default options and docs URLs.
 *
 * @param urlCreator Creates a documentation URL for a given rule name.
 * @returns Function to create a rule with the docs URL format.
 */
function RuleCreator(urlCreator: (name: string) => string) {
  // This function will get much easier to call when this is merged https://github.com/Microsoft/TypeScript/pull/26349
  // TODO: when the above PR lands; add type checking for the context.report `data` property
  return function createNamedRule<Options extends readonly unknown[], MessageIds extends string>({
    name,
    meta,
    ...rule
  }: Readonly<RuleWithMetaAndName<Options, MessageIds>>): RuleModule<Options> {
    return createRule<Options, MessageIds>({
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

/**
 * Creates a well-typed TSESLint custom ESLint rule without a docs URL.
 *
 * @returns Well-typed TSESLint custom ESLint rule.
 * @remarks It is generally better to provide a docs URL function to RuleCreator.
 */
function createRule<Options extends readonly unknown[], MessageIds extends string>({
  create,
  defaultOptions,
  meta
}: Readonly<RuleWithMeta<Options, MessageIds>>): RuleModule<Options> {
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

export const createEslintRule = RuleCreator(
  ruleName => {
    const ns = ruleName.split('-')[0]
    return `${blobUrl}${ns}/${ruleName}.test.ts`
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) as any as <Options extends readonly unknown[], MessageIds extends string>({
  name,
  meta,
  ...rule
}: Readonly<RuleWithMetaAndName<Options, MessageIds>>) => RuleModule<Options>
