/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { createRule } from '../utils/rule.ts'

import type { Comment } from '../utils/types.ts'

type Options = {
  tags: string[]
}

const DEFAULT_TAGS = ['FIXME', 'BUG']

/**
 * Remove JSDoc asterisk prefix if present
 */
function stripJSDocPrefix(line: string): string {
  const trimmed = line.trim()
  return trimmed.startsWith('*') ? trimmed.slice(1).trim() : trimmed
}

const rule: ReturnType<typeof createRule> = createRule({
  name: 'no-tag-comments',
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow tag comments',
      category: 'Comment',
      recommended: false,
      defaultSeverity: 'warn'
    },
    messages: {
      tagComment: "Exist '{{tag}}' tag comment"
    },
    schema: [
      {
        type: 'object',
        properties: {
          tags: {
            type: 'array',
            items: {
              type: 'string'
            },
            minItems: 1,
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(ctx) {
    const options: Options = ctx.options[0] || { tags: DEFAULT_TAGS }
    const tags = options.tags || DEFAULT_TAGS
    const sourceCode = ctx.sourceCode

    /**
     * Check if the text starts with a tag followed by valid delimiter
     */
    function hasTag(text: string): string | null {
      for (const tag of tags) {
        if (text.startsWith(tag)) {
          const afterTag = text.slice(tag.length)
          if (afterTag === '' || afterTag.startsWith(':') || afterTag.startsWith(' ')) {
            return tag
          }
        }
      }
      return null
    }

    /**
     * Report a tag comment violation
     */
    function reportTag(comment: Comment, tag: string, loc?: { line: number; column: number }) {
      if (loc && comment.loc) {
        // For block comments, report specific location
        ctx.report({
          messageId: 'tagComment',
          data: { tag },
          loc: {
            start: {
              line: loc.line,
              column: loc.column
            },
            end: {
              line: loc.line,
              column: loc.column + tag.length
            }
          }
        })
      } else {
        // For line comments, report whole comment
        ctx.report({
          messageId: 'tagComment',
          data: { tag },
          loc: comment.loc!
        })
      }
    }

    /**
     * Check a comment for tag violations
     */
    function checkComment(comment: Comment) {
      const { value, type } = comment

      if (type === 'Line') {
        const tag = hasTag(value.trim())
        if (tag) {
          // Calculate the exact position of the tag in the line comment
          const tagIndex = value.indexOf(tag)
          if (tagIndex !== -1) {
            reportTag(comment, tag, {
              line: comment.loc!.start.line,
              column: comment.loc!.start.column + 2 + tagIndex // +2 for "//"
            })
          }
        }
        return
      }

      // Block comment
      const lines = value.split('\n')
      let currentLine = comment.loc!.start.line

      for (const [i, line] of lines.entries()) {
        const trimmedLine = line.trim()

        // Skip empty lines
        if (!trimmedLine) {
          currentLine++
          continue
        }

        // Remove JSDoc prefix if present
        const contentToCheck = stripJSDocPrefix(line)
        const tag = hasTag(contentToCheck)

        if (tag) {
          // Calculate the exact column position of the tag
          let columnOffset = comment.loc!.start.column

          // For the first line, add the comment opener length
          if (i === 0) {
            const opener = line.match(/^(\s*\/\*+\s*)/)?.[0] || ''
            columnOffset += opener.length

            // Find tag position after opener
            const afterOpener = line.slice(opener.length)
            const tagIndexInAfterOpener = afterOpener.indexOf(tag)
            if (tagIndexInAfterOpener !== -1) {
              reportTag(comment, tag, {
                line: currentLine,
                column: columnOffset + tagIndexInAfterOpener
              })
              break
            }
          } else {
            // For subsequent lines, find where the tag starts
            const tagIndex = line.indexOf(tag)
            if (tagIndex !== -1) {
              reportTag(comment, tag, {
                line: currentLine,
                column: tagIndex
              })
              break
            }
          }
        }

        currentLine++
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
