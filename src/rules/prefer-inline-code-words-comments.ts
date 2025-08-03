/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { calculateWordPosition, processAllComments } from '../utils/comment.ts'
import { createWordBoundaryRegex, isWordWrapped } from '../utils/regex.ts'
import { createRule } from '../utils/rule.ts'

import type { Comment } from '../utils/types.ts'

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
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        required: ['words'],
        additionalProperties: false
      }
    ]
  },
  create(ctx) {
    const options: Options = ctx.options[0]
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
            fix(fixer) {
              const startOffset = comment.range![0] + 2 + index // +2 for comment start
              const endOffset = startOffset + word.length
              return fixer.replaceTextRange([startOffset, endOffset], `\`${word}\``)
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
