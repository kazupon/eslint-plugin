/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { parseComment } from '@es-joy/jsdoccomment'
import { createRule } from '../utils/rule.ts'

import type { Comment } from '../utils/types.ts'

const ENFORCED_TAGS = ['author', 'license']

type TagDiagnosis = {
  [tag: string]: 'require' | 'enforce' | 'ok'
}

function initializeTagDiagnosis(tags: string[]) {
  const tagDiagnosis: TagDiagnosis = {}
  for (const tag of tags) {
    tagDiagnosis[tag] = 'require'
  }
  return tagDiagnosis
}

function validTagDiagnosis(tagDiagnosis: TagDiagnosis) {
  return Object.keys(tagDiagnosis).every(tag => tagDiagnosis[tag] === 'ok')
}

const rule: ReturnType<typeof createRule> = createRule({
  name: 'enforce-header-comment',
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    docs: {
      description: 'Enforce heading the comment in source code file',
      category: 'Comment',
      recommended: true,
      defaultSeverity: 'error'
    },
    messages: {
      headerCommentEnforce: 'Header comment is enforced',
      headerCommentNeedTag: 'Header comment need `@{{tag}}` tag',
      headerCommentNeedTagValue: 'Header `@{{tag}}` tag need a value'
    },
    schema: []
  },
  defaultOptions: [{}],
  create(ctx) {
    /**
     * Report the tag diagnosis
     * @param comment - A target comment node
     * @param tags - A list of tags to check
     * @param tagDiagnosis - A map of tag diagnosis
     * @returns true if the comment has all required tags, false otherwise
     */
    function reportTagDiagnosis(
      comment: ReturnType<typeof ctx.sourceCode.getAllComments>[0],
      tags: string[],
      tagDiagnosis: TagDiagnosis
    ) {
      let reported = false

      for (const tag of tags) {
        if (tagDiagnosis[tag] === 'ok') {
          continue
        }
        ctx.report({
          loc: comment.loc,
          messageId:
            tagDiagnosis[tag] === 'require' ? 'headerCommentNeedTag' : 'headerCommentNeedTagValue',
          data: { tag }
        })
        reported = true
      }

      return reported
    }

    /**
     * The target comments, which is able to lint
     */
    let taregetComments: Comment[] = []

    return {
      /**
       * NOTE:
       * collect comments on `Program` node.
       * we need to care the below cases:
       * - source code file has no body in `Program` node
       * - last JSDoc comment is put on nodes (e.g. `export function add(a, b) {}`)
       */
      Program: node => {
        // reset target comments
        taregetComments.length = 0

        // if `Program` node will not have body, source code file will have comment only
        const hasCommentOnly = node.body.length === 0

        // keep `Program` node start position
        const start = hasCommentOnly ? node.range[1] : node.range[0]

        // get all block comments on `Program` node only
        const comments = ctx.sourceCode
          .getAllComments()
          .filter(comment => comment.range[1] <= start) // only get comments before `Program` node
          .filter(comment => comment.type === 'Block')
          .filter(comment => comment.value.startsWith('*')) // only jsdoc comments

        if (comments.length === 0) {
          taregetComments = []
          return
        }

        if (hasCommentOnly) {
          taregetComments = comments
        } else {
          // if `Program` node has body, we need to check the last comment, which is on the first programme statement node
          const lastComment = comments.at(-1)!
          const firstNode = node.body[0]
          const distance = Math.abs(lastComment.range[1] - firstNode.range[0])
          taregetComments = distance > 1 ? comments : comments.slice(0, -1)
        }
      },

      /**
       * NOTE:
       * lint the target comments on `Program:exit` node.
       */
      'Program:exit': node => {
        const comments = taregetComments

        // if no header comment found, eslint will report
        if (comments.length === 0) {
          const topLoc = {
            start: {
              line: node.loc.start.line - 1,
              column: node.loc.start.column
            },
            end: {
              line: node.loc.end.line - 1,
              column: node.loc.end.column
            }
          }
          ctx.report({ loc: topLoc, messageId: 'headerCommentEnforce' })
          ctx.report({ loc: topLoc, messageId: 'headerCommentNeedTag', data: { tag: 'author' } })
          ctx.report({ loc: topLoc, messageId: 'headerCommentNeedTag', data: { tag: 'license' } })
          return
        }

        const commentWithAstNodes = comments.map(comment => ({
          comment,
          ast: parseComment(comment)
        }))

        let reported = false
        for (const { comment, ast } of commentWithAstNodes) {
          if (reported) {
            break
          }

          const found = ast.tags.some(tag => ENFORCED_TAGS.includes(tag.tag))
          if (ast.tags.length > 0 && !found) {
            continue
          }

          const tagDiagnosis = initializeTagDiagnosis(ENFORCED_TAGS)
          for (const tag of ast.tags) {
            if (tagDiagnosis[tag.tag]) {
              tagDiagnosis[tag.tag] = tag.description ? 'ok' : 'enforce'
            }
          }

          if (validTagDiagnosis(tagDiagnosis)) {
            break
          }

          reported = reportTagDiagnosis(comment, ENFORCED_TAGS, tagDiagnosis)
        }
      }
    }
  }
})

export default rule
