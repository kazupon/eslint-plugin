/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { createRule } from '../utils/rule.ts'
import { stripJSDocPrefix, detectTag, calculateTagLocation } from '../utils/comment.ts'

import type { Comment } from '../utils/types.ts'

type Options = {
  tags: string[]
}

const DEFAULT_TAGS = ['TODO', 'FIXME', 'HACK', 'BUG', 'NOTE']

const rule: ReturnType<typeof createRule> = createRule({
  name: 'prefer-scope-on-tag-comment',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce adding a scope to tag comments',
      category: 'Comment',
      recommended: true,
      defaultSeverity: 'warn'
    },
    messages: {
      missingScope: "Tag comment '{{tag}}' is missing a scope. Use format: {{tag}}(scope)"
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
     * Report a missing scope violation
     */
    function reportMissingScope(
      comment: Comment,
      tag: string,
      loc?: { line: number; column: number }
    ) {
      if (!comment.loc) {
        // Fallback if comment location is not available
        ctx.report({
          messageId: 'missingScope',
          data: { tag },
          node: ctx.sourceCode.ast
        })
        return
      }

      if (loc && comment.loc) {
        // For block comments, report specific location
        ctx.report({
          messageId: 'missingScope',
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
          messageId: 'missingScope',
          data: { tag },
          loc: comment.loc
        })
      }
    }

    /**
     * Check a comment for missing scope
     */
    function checkComment(comment: Comment) {
      const { value, type } = comment

      if (type === 'Line') {
        const tagInfo = detectTag(value.trim(), tags)
        if (tagInfo && !tagInfo.hasScope) {
          // Calculate the exact position of the tag in the line comment
          const tagIndex = value.indexOf(tagInfo.tag)
          if (tagIndex !== -1) {
            reportMissingScope(comment, tagInfo.tag, {
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

        if (tagInfo && !tagInfo.hasScope) {
          // For the first line, handle the comment opener
          const location = calculateTagLocation(comment, line, i, tagInfo.tag)
          if (location) {
            reportMissingScope(comment, tagInfo.tag, location)
            break
          }
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
