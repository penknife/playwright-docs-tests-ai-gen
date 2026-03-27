# Playwright E2E Test Automation — Agent Instructions

## Project Overview
This project contains E2E tests for https://playwright.dev built with Playwright + TypeScript.
All test plans, specs, code and comments must be written in English.

## Target Application
- URL: https://playwright.dev
- Type: Documentation website (static, no authentication)
- Key sections: Docs, API, Community, Release Notes
- Main interactions: navigation, search, sidebar, code examples, version switcher

## Agent Workflow
Always follow this strict sequence — never skip steps:
1. 🎭 Planner → explores the app, produces `specs/*.md`
2. 🎭 Generator → transforms spec into `tests/**/*.spec.ts`
3. 🎭 Healer → fixes failing tests automatically

## Architecture
- Page Objects → `pages/*.page.ts`
- Tests → `tests/**/*.spec.ts`
- Fixtures → `fixtures/*.fixture.ts` (named by functionality, e.g. `docs.fixture.ts`)
- Specs (Planner output) → `specs/*.md`
- Helpers → `helpers/*.ts`

## Page Objects to Create
- `pages/home.page.ts` — homepage, nav, hero section
- `pages/docs.page.ts` — sidebar, content area, breadcrumbs
- `pages/search.page.ts` — search modal, results
- `pages/api.page.ts` — API reference navigation

## Component Classes
Shared UI elements that appear on multiple pages must be extracted into dedicated component classes, not duplicated in each Page Object.

- Components live in `pages/components/*.ts`
- Each component encapsulates all locators and methods for that UI element
- Page Objects compose components as class properties

Example:
```
pages/components/left-navigation-panel.ts  — all methods for the left nav panel
pages/components/top-navigation.ts         — top nav bar shared across pages
pages/components/search-modal.ts           — search modal shared across pages
```

Page Object usage example:
```ts
export class DocsPage {
  readonly leftNav: LeftNavigationPanel;

  constructor(page: Page) {
    this.leftNav = new LeftNavigationPanel(page);
  }
}
```

## Design Patterns
Apply the following patterns where appropriate:

- **DTO (Data Transfer Object)** — use a single typed object parameter instead of multiple method arguments:
  ```ts
  // ✅ preferred
  async search(options: { query: string; language?: string }) {}
  // ❌ avoid
  async search(query: string, language?: string) {}
  ```
- **Builder** — use a builder class to construct complex objects step by step, especially for test data or configuration objects
- **Facade** — hide complex or multi-step logic behind a simple facade method; tests should call the facade, not orchestrate internals directly

Use these patterns only when they reduce complexity — don't over-engineer simple cases.

## Code Principles
Always apply the following principles:

- **SOLID** — single responsibility per class/method, open for extension, depend on abstractions
- **DRY** (Don't Repeat Yourself) — extract repeated logic into shared components, helpers, or base classes
- **KISS** (Keep It Simple, Stupid) — prefer simple, readable solutions over clever ones
- **YAGNI** (You Aren't Gonna Need It) — don't add functionality until it is actually needed

## TypeScript Rules
- Strict mode always enabled
- No `any` types allowed
- All Page Object locators must be typed

## Selector Priority (follow strictly)
1. `getByRole()` — always first choice
2. `getByTestId()` — if data-testid exists
3. `getByLabel()`, `getByPlaceholder()`, `getByText()`
4. CSS selectors — last resort only, add comment why

## Assertions Rules
- NEVER use `waitForTimeout()` — use Playwright auto-waiting
- NEVER use hardcoded timeouts
- Prefer: `toBeVisible()`, `toHaveText()`, `toHaveURL()`, `toHaveTitle()`
- Always assert meaningful user-visible state
- All assertions MUST include a failure message, e.g. `expect(locator, 'message').toBeVisible()`

## Test Structure
- Each test = one user scenario with clear action + expected result
- Group with `test.describe()` per feature/section
- Prefer **fixtures** over `test.beforeEach()` for navigation and page setup — fixtures are composable, reusable, and produce cleaner test code
- Name fixture files by functionality, not `index.ts` — e.g. `fixtures/docs.fixture.ts`, `fixtures/search.fixture.ts`
- Each fixture file extends the base `test` object:
  ```ts
  // fixtures/docs.fixture.ts
  import { test as base } from '@playwright/test';
  import { DocsPage } from '../pages/docs.page';

  export const test = base.extend<{ docsPage: DocsPage }>({
    docsPage: async ({ page }, use) => {
      const docsPage = new DocsPage(page);
      await docsPage.goto();
      await use(docsPage);
    },
  });
  export { expect } from '@playwright/test';
  ```
- Use `test.beforeEach()` only for simple shared state that doesn't warrant a fixture
- One spec file = one feature or user flow

## Naming Conventions
- Page Objects: `docs.page.ts`
- Test files: `navigation.spec.ts`
- Spec plans: `navigation-flow.md`
- Fixtures: `docs.fixture.ts` — named by functionality, never `index.ts`

## Seed Test Reference
Always include `tests/seed.spec.ts` in Planner context.
No authentication needed — seed only navigates to the homepage.

## Key User Flows to Cover
1. Homepage navigation
2. Docs sidebar navigation
3. Search functionality
4. Language switcher (Node.js / Python / Java / .NET)
5. Version switcher
6. "Getting Started" flow
7. API reference navigation
8. Community links