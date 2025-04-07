import { createEslintRule } from '../utils/create.ts'

export default createEslintRule({
  name: 'comment-require-header',
  meta: {
    docs: {
      description: 'Enforce using "catalog:" in `package.json`'
    },
    schema: []
  },
  defaultOptions: [],
  create(_context, [options]) {
    console.log('options', options)
    // TODO: implement the rule
    return {}
  }
})
