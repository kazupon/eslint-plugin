/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { calculateWordPosition, processAllComments } from '../utils/comment.ts'
import { createWordBoundaryRegex, isWordWrapped } from '../utils/regex.ts'
import { createRule } from '../utils/rule.ts'

import type { Comment } from '../utils/types.ts'
import type { Rule } from 'eslint'

type Options = {
  words: string[]
}

const rule: ReturnType<typeof createRule> = createRule({
  name: 'prefer-inline-code-words-comments',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce the use of inline code for specific words on comments',
      category: 'Comment',
      recommended: true,
      defaultSeverity: 'error'
    },
    fixable: 'code',
    messages: {
      missingInlineCode: 'The word "{{word}}" should be wrapped in inline code'
    },
    schema: [
      {
        type: 'object',
        properties: {
          words: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        required: ['words'],
        additionalProperties: false
      }
    ]
  },
  create(ctx) {
    const options = ctx.options[0] as Options
    if (!options || !options.words || options.words.length === 0) {
      return {}
    }

    const words = options.words
    const sourceCode = ctx.sourceCode

    /**
     * Check a comment for words that should be wrapped in inline code
     *
     * @param comment - The comment node to check
     */
    function checkComment(comment: Comment) {
      const { value } = comment

      for (const word of words) {
        const regex = createWordBoundaryRegex(word)

        let match

        while ((match = regex.exec(value)) !== null) {
          const index = match.index

          // Check if the word is already wrapped in backticks
          if (isWordWrapped(value, index, word)) {
            continue
          }

          // Calculate position
          const position = calculateWordPosition(comment, index, word)

          ctx.report({
            messageId: 'missingInlineCode',
            data: { word },
            loc: {
              start: position,
              end: { line: position.line, column: position.column + word.length }
            },
            *fix(fixer) {
              const start = comment.range![0] + 2 + index // +2 for comment start "//" or "/*"
              const end = start + word.length
              return [
                yield fixer.insertTextBeforeRange([start, start], '`'),
                yield fixer.insertTextAfterRange([start, end], '`')
              ] as Rule.Fix[]
            }
          })
        }
      }
    }

    return {
      Program() {
        processAllComments(sourceCode, checkComment)
      }
    }
  }
})

export default rule
