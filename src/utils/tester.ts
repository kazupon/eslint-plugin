/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { RuleTester as ESLintRuleTester } from 'eslint'
import { RuleTester as OxlintRuleTester } from 'oxlint'
import { describe, it } from 'vitest'

import type { Overwrite } from '@kazupon/jts-utils/types'
import type { Linter } from 'eslint'

ESLintRuleTester.describe = describe
ESLintRuleTester.it = it
ESLintRuleTester.itOnly = it.only

OxlintRuleTester.describe = describe
OxlintRuleTester.it = it
OxlintRuleTester.itOnly = it.only

/**
 * The type for valid test case.
 */
export type ValidTestCase = (ESLintRuleTester.ValidTestCase | OxlintRuleTester.ValidTestCase) & {
  description?: string
}

/**
 * The type for invalid test case.
 */
export type InvalidTestCase = (
  | ESLintRuleTester.InvalidTestCase
  | OxlintRuleTester.InvalidTestCase
) & { description?: string }

type RuleTestLinterType = 'eslint' | 'oxlint'

type RuleTestLinterOptions = {
  type: RuleTestLinterType
  options?: Linter.Config | OxlintRuleTester.Config
}

type RuleTestLinter = RuleTestLinterType | RuleTestLinterOptions

/**
 * Rule test options for {@link run | rule testers}.
 */
interface RuleTestOptions {
  /**
   * The rule name
   */
  name: string
  /**
   * The rule object
   */
  rule: any
  /**
   * Rules to be tested with linters
   *
   * @default ['eslint']
   */
  linter?: RuleTestLinter[]
  /**
   * Valid test cases
   *
   * @default []
   */
  valid?: ValidTestCase[]
  /**
   * Invalid test cases
   *
   * @default []
   */
  invalid?: InvalidTestCase[]
}

/**
 * Run the rule tests
 *
 * @param options - The rule test options
 */
export function run(options: RuleTestOptions): void {
  const resolvedOptions = resolveRuleTesterOptions(options)
  for (const linter of resolvedOptions.linter) {
    let tester: ESLintRuleTester | OxlintRuleTester | undefined
    if (linter.type === 'eslint') {
      tester = new ESLintRuleTester(linter.options as Linter.Config)
    } else if (linter.type === 'oxlint') {
      tester = new OxlintRuleTester(linter.options as OxlintRuleTester.Config)
    } else {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- ignore
      throw new Error(`Unsupported linter type: ${linter.type}`)
    }

    describe(`Rule Tester: ${linter.type}`, () => {
      tester.run(
        resolvedOptions.name,
        resolvedOptions.rule, // eslint-disable-line @typescript-eslint/no-unsafe-argument -- ignore
        {
          // @ts-ignore -- compatibility for eslint and oxlint
          valid: resolvedOptions.valid,
          // @ts-ignore -- compatibility for eslint and oxlint
          invalid: resolvedOptions.invalid
        }
      )
    })
  }
}

function resolveRuleTesterOptions(
  options: RuleTestOptions
): Overwrite<
  RuleTestOptions,
  { linter: RuleTestLinterOptions[]; valid: ValidTestCase[]; invalid: InvalidTestCase[] }
> {
  return {
    ...options,
    linter: (options.linter ?? ['eslint']).map(l => {
      if (typeof l === 'string') {
        const ret = { type: l } as RuleTestLinterOptions
        if (l === 'oxlint') {
          ret.options = {
            eslintCompat: true
          }
        }
        return ret
      } else if ('type' in l) {
        return l
      } else {
        throw new Error('Invalid linter option')
      }
    }),
    // NOTE(kazupon): remove description field for RuleTester of ESLint, because ESLint checks unknown fields.
    valid: (options.valid ?? []).map(v => {
      const ret = { ...v }
      delete ret.description
      return ret
    }),
    // NOTE(kazupon): remove description field for RuleTester of ESLint, because ESLint checks unknown fields.
    invalid: (options.invalid ?? []).map(v => {
      const ret = { ...v }
      delete ret.description
      return ret
    })
  }
}
