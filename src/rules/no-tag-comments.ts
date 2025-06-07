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
      avoidTagComment: "Fix '{{tag}}' tag comment"
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
    function reportTag(comment: Comment, tag: string) {
      ctx.report({
        messageId: 'avoidTagComment',
        data: { tag },
        loc: comment.loc!
      })
    }

    /**
     * Process a single line of text for tags
     */
    function checkLine(text: string, comment: Comment): boolean {
      const tag = hasTag(text)
      if (tag) {
        reportTag(comment, tag)
        return true
      }
      return false
    }

    /**
     * Check a comment for tag violations
     */
    function checkComment(comment: Comment) {
      const { value, type } = comment

      if (type === 'Line') {
        checkLine(value.trim(), comment)
        return
      }

      // Block comment
      const lines = value.split('\n')

      // Single line block comment
      if (lines.length === 1) {
        checkLine(value.trim(), comment)
        return
      }

      // Multiline block comment - check each line
      for (const line of lines) {
        const trimmedLine = line.trim()

        // Skip empty lines
        if (!trimmedLine) {
          continue
        }

        const contentToCheck = stripJSDocPrefix(line)

        // Stop checking once a tag is found
        if (checkLine(contentToCheck, comment)) {
          break
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
