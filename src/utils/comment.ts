/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import type { Rule, SourceCode } from 'eslint'
import type { Comment } from './types.ts'

/**
 * Remove JSDoc asterisk prefix if present
 *
 * @param line - The line of text to strip
 * @returns The stripped line of text
 */
export function stripJSDocPrefix(line: string): string {
  const trimmed = line.trim()
  return trimmed.startsWith('*') ? trimmed.slice(1).trim() : trimmed
}

/**
 * Tag detection result
 */
interface TagDetectionResult {
  tag: string
  hasScope: boolean
}

/**
 * Check if the text starts with any of the given tags
 *
 * @param text - The text to check
 * @param tags - Array of tags to search for
 * @returns Tag detection result or null if no tag found
 */
export function detectTag(text: string, tags: string[]): TagDetectionResult | null {
  for (const tag of tags) {
    // Use word boundary regex to ensure tag is a standalone word
    const tagRegex = new RegExp(`^${tag}\\b`)
    const match = text.match(tagRegex)
    if (match) {
      const afterTag = text.slice(tag.length)

      // Check if tag is followed by a scope in parentheses
      if (afterTag.startsWith('(')) {
        const closingParenIndex = afterTag.indexOf(')')
        if (closingParenIndex > 0) {
          // Has scope if there's content between parentheses
          const scope = afterTag.slice(1, closingParenIndex).trim()
          return { tag, hasScope: scope.length > 0 }
        }
        // If we have opening paren but no closing or empty scope, it's invalid
        return { tag, hasScope: false }
      }

      // Check if tag is followed by valid delimiter without scope
      if (afterTag === '' || afterTag.startsWith(':') || afterTag.startsWith(' ')) {
        return { tag, hasScope: false }
      }
    }
  }
  return null
}

/**
 * Calculate the exact location of a tag in a comment
 *
 * @param comment - The comment containing the tag
 * @param line - The line of text containing the tag
 * @param lineIndex - The index of the line within the comment
 * @param tag - The tag to locate
 * @returns Location with line and column, or null if not found
 */
export function calculateTagLocation(
  comment: Comment,
  line: string,
  lineIndex: number,
  tag: string
): { line: number; column: number } | null {
  const tagIndex = line.indexOf(tag)
  if (tagIndex === -1) return null

  if (lineIndex === 0) {
    // First line: account for comment opener
    const tagIndexInValue = comment.value.indexOf(tag)
    return tagIndexInValue === -1
      ? null
      : {
          line: comment.loc!.start.line,
          column: comment.loc!.start.column + 2 + tagIndexInValue
        }
  } else {
    // Subsequent lines
    return {
      line: comment.loc!.start.line + lineIndex,
      column: tagIndex
    }
  }
}

/**
 * Process all comments in a source file
 *
 * @param sourceCode - The ESLint source code object
 * @param callback - Function to call for each comment
 */
export function processAllComments(
  sourceCode: SourceCode,
  callback: (comment: Comment) => void
): void {
  const comments = sourceCode.getAllComments()
  for (const comment of comments) {
    callback(comment)
  }
}

/**
 * Calculate the position of a word in a comment
 *
 * @param comment - The comment containing the word
 * @param wordIndex - The index of the word in the comment value
 * @param _word - The word itself (unused but needed for API compatibility)
 * @returns Location with line and column
 */
export function calculateWordPosition(
  comment: Comment,
  wordIndex: number,
  _word: string
): { line: number; column: number } {
  const { value, type } = comment

  if (type === 'Line') {
    return {
      line: comment.loc!.start.line,
      column: comment.loc!.start.column + 2 + wordIndex // +2 for "//"
    }
  }

  // Block comment
  const beforeMatch = value.slice(0, Math.max(0, wordIndex))
  const beforeLines = beforeMatch.split('\n')
  const lineIndex = beforeLines.length - 1
  const line = comment.loc!.start.line + lineIndex

  if (lineIndex === 0) {
    // First line of block comment
    return {
      line,
      column: comment.loc!.start.column + 2 + beforeMatch.length // +2 for "/*"
    }
  } else {
    // For subsequent lines in block comments
    const columnInValue = beforeMatch.length - beforeLines.slice(0, -1).join('\n').length - 1
    return {
      line,
      column: Math.max(0, columnInValue)
    }
  }
}

/**
 * Report a comment violation with standardized location handling
 *
 * @param ctx - The ESLint rule context
 * @param comment - The comment where the violation occurred
 * @param messageId - The message ID to report
 * @param data - Data for the message template
 * @param location - Optional specific location within the comment
 */
export function reportCommentViolation(
  ctx: Rule.RuleContext,
  comment: Comment,
  messageId: string,
  data?: Record<string, unknown>,
  location?: { line: number; column: number; length?: number }
): void {
  if (!comment.loc) {
    ctx.report({
      messageId,
      data,
      node: ctx.sourceCode.ast
    })
    return
  }

  if (location) {
    ctx.report({
      messageId,
      data,
      loc: {
        start: {
          line: location.line,
          column: location.column
        },
        end: {
          line: location.line,
          column: location.column + (location.length || 0)
        }
      }
    })
  } else {
    ctx.report({
      messageId,
      data,
      loc: comment.loc
    })
  }
}

/**
 * Parse directive comment and extract description
 * Handles both eslint-style (--) and TypeScript-style (space) separators
 *
 * @param text - The comment text to parse
 * @param directives - List of directive patterns to check for
 * @returns Parsed directive info or null if not a directive
 */
export function parseDirectiveComment(
  text: string,
  directives: string[]
): {
  directive: string
  description: string
  descriptionStart: number
} | null {
  const trimmedText = text.trim()

  for (const directive of directives) {
    if (trimmedText.startsWith(directive)) {
      const afterDirective = trimmedText.slice(directive.length)

      // Look for description after -- separator
      const separatorIndex = afterDirective.indexOf('--')
      if (separatorIndex !== -1) {
        const description = afterDirective.slice(separatorIndex + 2).trim()
        const separatorPos = text.indexOf('--')
        const afterSeparator = text.slice(separatorPos + 2)
        const descriptionStart =
          separatorPos + 2 + (afterSeparator.length - afterSeparator.trimStart().length)
        return { directive, description, descriptionStart }
      }

      // Also check for space-separated description
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
