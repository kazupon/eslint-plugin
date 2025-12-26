/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import {
  calculateTagLocation,
  detectTag,
  stripJSDocPrefix,
  processAllComments,
  reportCommentViolation
} from '../utils/comment.ts'
import { createRule } from '../utils/rule.ts'

import type { Comment } from '../utils/types.ts'

export const DEFAULT_TAGS = ['FIXME', 'BUG'] as const

type Options = {
  tags: string[]
}

const rule: ReturnType<typeof createRule> = createRule({
  name: 'no-tag-comments',
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow tag comments',
      category: 'Comment',
      recommended: true,
      defaultSeverity: 'warn'
    },
    messages: {
      tagComment: "Exist '{{tag}}' tag comment"
    },
    defaultOptions: [{ tags: DEFAULT_TAGS }],
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
    const options = ctx.options[0] as Options
    const tags = options.tags
    const sourceCode = ctx.sourceCode

    /**
     * Report a tag comment violation
     *
     * @param comment - The comment node to report
     * @param tag - The tag that was found in the comment
     * @param loc - Optional location information for the tag
     */
    function reportTag(comment: Comment, tag: string, loc?: { line: number; column: number }) {
      reportCommentViolation(
        ctx,
        comment,
        'tagComment',
        { tag },
        loc ? { ...loc, length: tag.length } : undefined
      )
    }

    /**
     * Check a comment for tag violations
     *
     * @param comment - The comment node to check
     */
    function checkComment(comment: Comment) {
      const { value, type } = comment

      if (type === 'Line') {
        const tagInfo = detectTag(value.trim(), tags)
        if (tagInfo) {
          // Calculate the exact position of the tag in the line comment
          const tagIndex = value.indexOf(tagInfo.tag)
          if (tagIndex !== -1) {
            reportTag(comment, tagInfo.tag, {
              line: comment.loc!.start.line,
              column: comment.loc!.start.column + 2 + tagIndex // +2 for "//"
            })
          }
        }
        return
      }

      // Block comment
      const lines = value.split('\n')

      for (const [i, line] of lines.entries()) {
        const trimmedLine = line.trim()

        // Skip empty lines
        if (!trimmedLine) {
          continue
        }

        // Remove JSDoc prefix if present
        const contentToCheck = stripJSDocPrefix(line)
        const tagInfo = detectTag(contentToCheck, tags)

        if (tagInfo) {
          // Use shared location calculation logic
          const location = calculateTagLocation(comment, line, i, tagInfo.tag)
          if (location) {
            reportTag(comment, tagInfo.tag, location)
            break
          }
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
