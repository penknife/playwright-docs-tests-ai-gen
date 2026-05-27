---
name: playwright-fixture-builder
description: 'Use when creating a new Playwright fixture file or adding a fixture to an existing one. Covers: fixture file naming, location, structure, extending the base test, and the full fixture template.'
---

# Playwright Fixture Builder

## Rules

- **Always use fixtures** over `test.beforeEach()` for navigation and page setup
- Fixture files are named by **functionality**, never `index.ts`
  - `fixtures/docs.fixture.ts`, `fixtures/search.fixture.ts`, etc.
- Each fixture file **extends** the base `test` from `@playwright/test`
- Import `test` and `expect` **from the fixture file**, not from `@playwright/test` directly

## File Location

```
fixtures/<feature-name>.fixture.ts
```

## Procedure

### Creating a New Fixture File

1. Identify the Page Object the fixture will set up
2. Create `fixtures/<name>.fixture.ts` following the template below
3. In the test file, import `test` and `expect` from this fixture:
   ```ts
   import { test, expect } from '../../fixtures/<name>.fixture';
   ```

### Adding a Fixture to an Existing File

1. Read the existing fixture file
2. Add a new fixture property to the `base.extend<{}>()` type parameter
3. Initialize the Page Object and call `goto()` before `use()`

---

## Fixture Template

```ts
import { test as base } from '@playwright/test';
import { ExamplePage } from '../pages/example.page';

export const test = base.extend<{ examplePage: ExamplePage }>({
  examplePage: async ({ page }, use) => {
    const examplePage = new ExamplePage(page);
    await examplePage.goto();
    await use(examplePage);
  },
});

export { expect } from '@playwright/test';
```

## Existing Fixtures

| File | Fixture name | Page Object |
|---|---|---|
| `fixtures/homepage.fixture.ts` | `homePage` | `HomePage` |
| `fixtures/docs.fixture.ts` | `docsPage` | `DocsPage` |
| `fixtures/search.fixture.ts` | `searchPage` | `SearchPage` (via `DocsPage`) |
| `fixtures/api.fixture.ts` | `apiPage` | `ApiPage` |
| `fixtures/language-switcher.fixture.ts` | `languageSwitcherPage` | `DocsPage` |

Always check this list before creating a new fixture — reuse an existing one when appropriate.
