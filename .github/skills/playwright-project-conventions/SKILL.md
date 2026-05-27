---
name: playwright-project-conventions
description: 'Coding conventions for this Playwright + TypeScript project. Use when writing, reviewing, or fixing test code, Page Objects, or fixtures. Covers: selector priority, assertion rules, TypeScript rules, design patterns (DTO, Facade, SOLID, DRY, KISS, YAGNI).'
---

# Playwright Project Conventions

## TypeScript Rules

- Strict mode always enabled
- No `any` types allowed
- All Page Object locators must be typed as `Locator`

## Selector Priority — follow strictly in this order

1. `getByRole()` — always first choice
2. `getByTestId()` — if `data-testid` exists
3. `getByLabel()`, `getByPlaceholder()`, `getByText()`
4. CSS selectors — last resort only; add a comment explaining why

## Assertion Rules

- **NEVER** use `waitForTimeout()` — rely on Playwright auto-waiting
- **NEVER** use hardcoded timeouts
- **NEVER** use `networkidle` or other deprecated/discouraged APIs
- Prefer: `toBeVisible()`, `toHaveText()`, `toHaveURL()`, `toHaveTitle()`
- Every assertion **MUST** include a failure message:
  ```ts
  await expect(locator, 'Search modal should be visible').toBeVisible();
  ```
- Always assert meaningful user-visible state

## Design Patterns

### DTO — single typed object over multiple arguments
```ts
// ✅ preferred
async search(options: { query: string; language?: string }) {}

// ❌ avoid
async search(query: string, language?: string) {}
```

### Facade — hide multi-step logic behind Page Object methods
Tests call the facade, not internal implementation details.

### Component Composition — shared UI elements as class properties
```ts
export class DocsPage {
  readonly leftNav: LeftNavigationPanel;

  constructor(page: Page) {
    this.leftNav = new LeftNavigationPanel(page);
  }
}
```

## Code Principles

Apply the following principles when they **reduce complexity** — never over-engineer:

- **SOLID** — single responsibility per class/method, open for extension, depend on abstractions
- **DRY** — extract repeated logic into shared components, helpers, or base classes
- **KISS** — prefer simple, readable solutions over clever ones
- **YAGNI** — do not add functionality until it is actually needed
