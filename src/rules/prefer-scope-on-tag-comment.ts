/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { createRule } from '../utils/rule.ts'
import { stripJSDocPrefix, detectTag, calculateTagLocation } from '../utils/comment.ts'

import type { Comment } from '../utils/types.ts'

type Options = {
  tags: string[]
  directives?: string[]
}

const DEFAULT_TAGS = ['TODO', 'FIXME', 'HACK', 'BUG', 'NOTE']
const DEFAULT_DIRECTIVES = [
  'eslint-disable',
  'eslint-disable-next-line',
  'eslint-disable-line',
  '@ts-expect-error',
  '@ts-ignore',
  '@ts-nocheck'
]

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
          },
          directives: {
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
    const directives = options.directives || DEFAULT_DIRECTIVES
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
     * Check if comment starts with a directive and extract the description
     * @returns Object with directive match info or null
     */
    function parseDirectiveComment(text: string): {
      directive: string
      description: string
      descriptionStart: number
    } | null {
      const trimmedText = text.trim()

      // Check if comment starts with any directive
      for (const directive of directives) {
        if (trimmedText.startsWith(directive)) {
          const afterDirective = trimmedText.slice(directive.length)

          // Look for description after -- separator
          const separatorIndex = afterDirective.indexOf('--')
          if (separatorIndex !== -1) {
            const description = afterDirective.slice(separatorIndex + 2).trim()
            // Calculate where the description starts in the original text
            const separatorPos = text.indexOf('--')
            const afterSeparator = text.slice(separatorPos + 2)
            const descriptionStart =
              separatorPos + 2 + (afterSeparator.length - afterSeparator.trimStart().length)
            return { directive, description, descriptionStart }
          }

          // Also check for space-separated description (for TS directives and custom directives)
          if (afterDirective.trim()) {
            const spaceMatch = afterDirective.match(/^\s+/)
            if (spaceMatch) {
              const description = afterDirective.trim()
              const directiveIndex = text.indexOf(directive)
              const descriptionStart = directiveIndex + directive.length + spaceMatch[0].length
              return { directive, description, descriptionStart }
            }
          }
        }
      }

      return null
    }

    /**
     * Check a comment for missing scope
     */
    function checkComment(comment: Comment) {
      const { value, type } = comment

      if (type === 'Line') {
        // First check for directive comments
        const directiveInfo = parseDirectiveComment(value)
        if (directiveInfo) {
          // Check for tags in the description part
          const tagInfo = detectTag(directiveInfo.description, tags)
          if (tagInfo && !tagInfo.hasScope) {
            const tagIndex = directiveInfo.description.indexOf(tagInfo.tag)
            if (tagIndex !== -1) {
              reportMissingScope(comment, tagInfo.tag, {
                line: comment.loc!.start.line,
                column: comment.loc!.start.column + 2 + directiveInfo.descriptionStart + tagIndex // +2 for "//"
              })
            }
          }
          return
        }

        // If not a directive, check for regular tag comments
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

      // First check if this is a multi-line directive comment
      const directiveInfo = parseDirectiveComment(value)

      if (directiveInfo) {
        // Check for tags in the description part
        const tagInfo = detectTag(directiveInfo.description, tags)
        if (tagInfo && !tagInfo.hasScope) {
          // For single-line block comments
          if (lines.length === 1) {
            const tagIndexInDesc = directiveInfo.description.indexOf(tagInfo.tag)
            if (tagIndexInDesc !== -1) {
              // Use the descriptionStart from directiveInfo which accounts for the position in the original text
              const tagIndexInValue = directiveInfo.descriptionStart + tagIndexInDesc
              const location = {
                line: comment.loc!.start.line,
                column: comment.loc!.start.column + 2 + tagIndexInValue // +2 for "/*"
              }
              reportMissingScope(comment, tagInfo.tag, location)
            }
          } else {
            // For multi-line directive comments, find which line contains the tag
            const descLines = directiveInfo.description.split('\n')
            for (const [descLineIndex, descLine] of descLines.entries()) {
              const lineTagInfo = detectTag(descLine.trim(), tags)
              if (lineTagInfo && !lineTagInfo.hasScope) {
                // Find the actual line in the original comment
                const descStartInComment = value.indexOf(directiveInfo.description)
                const linesBeforeDesc = value.slice(0, descStartInComment).split('\n').length - 1
                const actualLineIndex = linesBeforeDesc + descLineIndex

                if (actualLineIndex < lines.length) {
                  const actualLine = lines[actualLineIndex]
                  const tagIndex = actualLine.indexOf(lineTagInfo.tag)
                  if (tagIndex !== -1) {
                    const location = {
                      line: comment.loc!.start.line + actualLineIndex,
                      column:
                        actualLineIndex === 0
                          ? comment.loc!.start.column + 2 + tagIndex // +2 for "/*"
                          : tagIndex
                    }
                    reportMissingScope(comment, lineTagInfo.tag, location)
                    break
                  }
                }
              }
            }
          }
        }
        return
      }

      // If not a directive, check each line for tag comments
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
