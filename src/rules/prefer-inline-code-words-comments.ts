/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { createRule } from '../utils/rule.ts'

import type { Comment } from '../utils/types.ts'

type Options = {
  words: string[]
}

/**
 * Check if a word is already wrapped in inline code
 *
 * @param text - The text to check
 * @param index - The index of the word in the text
 * @param word - The word to check
 * @returns True if the word is already wrapped in backticks
 */
function isWrappedInBackticks(text: string, index: number, word: string): boolean {
  const beforeIndex = index - 1
  const afterIndex = index + word.length
  return (
    beforeIndex >= 0 &&
    afterIndex < text.length &&
    text[beforeIndex] === '`' &&
    text[afterIndex] === '`'
  )
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
      const { value, type } = comment

      for (const word of words) {
        // Escape special regex characters in the word
        const escapedWord = word.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)

        // Create regex with word boundaries
        // For words with dots (like console.log), we still use word boundaries
        // but the dots are escaped so they match literally
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'g')

        let match

        while ((match = regex.exec(value)) !== null) {
          const index = match.index

          // Check if the word is already wrapped in backticks
          if (isWrappedInBackticks(value, index, word)) {
            continue
          }

          // Calculate position based on comment type
          let line: number
          let column: number

          if (type === 'Line') {
            line = comment.loc!.start.line
            column = comment.loc!.start.column + 2 + index // +2 for "//"
          } else {
            // Block comment
            const beforeMatch = value.slice(0, Math.max(0, index))
            // const lines = value.split('\n')
            const beforeLines = beforeMatch.split('\n')
            const lineIndex = beforeLines.length - 1
            line = comment.loc!.start.line + lineIndex

            if (lineIndex === 0) {
              // First line of block comment
              column = comment.loc!.start.column + 2 + beforeMatch.length // +2 for "/*"
            } else {
              // For subsequent lines in block comments
              // We need to find the position in the specific line
              const allLines = value.split('\n')
              const currentLine = allLines[lineIndex]
              const wordIndexInLine = currentLine.indexOf(word)

              // The column matches calculateTagLocation: just the index in the line
              column = wordIndexInLine
            }
          }

          ctx.report({
            messageId: 'missingInlineCode',
            data: { word },
            loc: {
              start: { line, column },
              end: { line, column: column + word.length }
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
        const comments = sourceCode.getAllComments()
        for (const comment of comments) {
          checkComment(comment)
        }
      }
    }
  }
})

export default rule
