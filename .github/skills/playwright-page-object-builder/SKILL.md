---
name: playwright-page-object-builder
description: 'Use when creating a new Page Object, adding a missing method to an existing Page Object, or creating a new Component class. Covers: file locations, class structure, component composition, locator rules, method patterns, and step-by-step procedure.'
---

# Playwright Page Object Builder

## Architecture

| Type | Location | Purpose |
|---|---|---|
| Page Objects | `pages/*.page.ts` | Full page — composes components, owns page-level locators and methods |
| Components | `pages/components/*.ts` | Shared UI elements used across multiple pages |

## Procedure

### Adding a Missing Method to an Existing Page Object

1. Read the target file (`pages/*.page.ts` or `pages/components/*.ts`)
2. Identify the correct class and where the method belongs
3. Follow the selector priority and DTO pattern from `playwright-project-conventions`
4. Write the method and save the file before writing the test

### Creating a New Page Object

1. Create `pages/<name>.page.ts` following the template below
2. Import and compose any relevant shared components from `pages/components/`
3. If a new component is needed, create it first (see Component template)

### Creating a New Component

1. Create `pages/components/<name>.ts` following the component template below
2. Import it in any Page Object that uses it

---

## Page Object Template

```ts
import { Page, Locator, expect } from '@playwright/test';
import { TopNavigation } from './components/top-navigation';
// import other components as needed

export class ExamplePage {
  readonly page: Page;
  readonly topNav: TopNavigation;
  // declare other component properties here

  // Page-level locators
  readonly mainContent: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topNav = new TopNavigation(page);
    // initialize other components

    // initialize page-level locators
    this.mainContent = page.getByRole('main');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://playwright.dev/...');
  }

  // Example facade method using DTO pattern
  async doSomething(options: { param: string }): Promise<void> {
    // implementation
  }
}
```

## Component Template

```ts
import { Page, Locator, expect } from '@playwright/test';

export class ExampleComponent {
  readonly page: Page;
  readonly container: Locator;

  constructor(page: Page) {
    this.page = page;
    this.container = page.getByRole('navigation', { name: 'Example' });
  }

  async verifyVisible(): Promise<void> {
    await expect(this.container, 'Component should be visible').toBeVisible();
  }

  // Example method using DTO pattern
  async navigateTo(options: { label: string }): Promise<void> {
    await this.container.getByRole('link', { name: options.label }).click();
  }
}
```

## Existing Components (always check before creating new ones)

| Component | File | Used On |
|---|---|---|
| `TopNavigation` | `pages/components/top-navigation.ts` | all pages |
| `LeftNavigationPanel` | `pages/components/left-navigation-panel.ts` | docs, api |
| `SearchModal` | `pages/components/search-modal.ts` | all pages |
| `LanguageSwitcher` | `pages/components/language-switcher.ts` | docs, api |
| `VersionSwitcher` | `pages/components/version-switcher.ts` | docs, api |

## Key Rules

- **Never inline locators in tests** — all locators live in Page Objects or Components
- Compose components as `readonly` class properties, initialized in `constructor`
- Use `getByRole()` first for all locators (see `playwright-project-conventions`)
- All async methods return `Promise<void>` unless a value is needed
- Facade methods hide multi-step logic — tests should not orchestrate internals
