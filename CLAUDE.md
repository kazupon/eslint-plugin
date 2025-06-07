# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
pnpm dev              # Launch ESLint config inspector for testing rules
pnpm test             # Run Vitest test suite
pnpm lint             # Run all linting (ESLint, Prettier, TypeScript, Knip)
pnpm fix              # Auto-fix all linting issues
pnpm typecheck        # Run TypeScript type checking

# Build and Release
pnpm build            # Build with tsdown bundler
pnpm docs:dev         # Start VitePress documentation server
pnpm docs:build       # Build documentation for production
```

## Code Architecture

### Plugin Structure

- **Entry Point**: `src/index.ts` exports the plugin with auto-generated configurations
- **Rule Factory**: `src/utils/rule.ts` provides `createRule()` factory for consistent rule creation
- **Type System**: `src/utils/types.ts` extends ESLint core types with custom metadata
- **Constants**: `src/utils/constants.ts` contains build-time injected values (`__NAME__`, `__VERSION__`, etc.)

### Rule Development Pattern

All rules follow this structure:

```typescript
const rule = createRule({
  name: 'rule-name',
  meta: {
    type: 'suggestion' | 'problem' | 'layout',
    docs: {
      description: 'Clear description',
      category: 'Category name',
      recommended: boolean,
      defaultSeverity: 'error' | 'warn' | 'off'
    },
    messages: { messageId: 'Message template with {{data}}' },
    schema: [] // JSON schema for options
  },
  create(ctx) {
    return {
      // AST visitor methods
    }
  }
})
```

### File Organization

- **Rules**: `src/rules/rule-name.ts` + `src/rules/rule-name.test.ts`
- **Documentation**: `docs/rules/rule-name.md` (auto-generated)
- **Export**: Add to `src/rules/index.ts`

### Testing Requirements

- Use `eslint-vitest-rule-tester` framework
- Include both `valids` and `invalids` test cases
- Provide `filename` context for realistic scenarios
- Test error messages and positions thoroughly

### Build System

- **tsdown**: Bundles TypeScript with build-time variable injection
- **Build-time Constants**: Access package metadata via `__NAME__`, `__VERSION__`, `__NAMESPACE__`
- **ESM Only**: Modern ES modules with `.js` import extensions required

### Documentation Automation

- Rules table auto-generated in README.md via `pnpm docs:readme`
- Rule documentation auto-generated via `pnpm docs:rules`
- Uses comment markers for automated content injection

### Code Quality Standards

- Must include JSDoc header comments with `@author` and `@license` tags
- All strict TypeScript options enabled
- Import paths must use `.js` extensions for internal modules
- Pre-commit hooks enforce code quality via lint-staged
