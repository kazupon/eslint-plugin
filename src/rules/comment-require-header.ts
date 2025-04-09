import { createEslintRule } from '../utils/create.ts'

const rule: ReturnType<typeof createEslintRule> = createEslintRule({
  name: 'comment-require-header',
  meta: {
    type: 'problem',
    messages: {},
    docs: {
      description: 'Enforce using "catalog:" in `package.json`'
    },
    schema: []
  },
  defaultOptions: [{}],
  create(ctx, [opts]) {
    console.log('ctx', ctx)
    console.log('opts', opts)
    // TODO: implement the rule
    return {}
  }
})

export default rule
