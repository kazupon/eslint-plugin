/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import type { Comment } from './types.ts'

/**
 * Remove JSDoc asterisk prefix if present
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
 * @param text The text to check
 * @param tags Array of tags to search for
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
 * @param comment The comment containing the tag
 * @param line The line of text containing the tag
 * @param lineIndex The index of the line within the comment
 * @param tag The tag to locate
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
