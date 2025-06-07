/**
 * @author kazuya kawaguchi (a.k.a. kazupon)
 * @license MIT
 */

import { createRule } from '../utils/rule.ts'

const rule: ReturnType<typeof createRule> = createRule({
  name: 'no-tag-comments',
  // TODO: should be define meta
  create(_ctx) {
    // TODO:
    return {}
  }
})

export default rule
