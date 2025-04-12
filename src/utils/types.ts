import type { RuleContext } from '@typescript-eslint/utils/ts-eslint'

type SourceCode = RuleContext<string, unknown[]>['sourceCode']

export type Comment = ReturnType<SourceCode['getAllComments']>[number]
