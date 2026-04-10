// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/api.fixture';

test.describe('API Reference Navigation', () => {
  test('should display correct API reference structure and sidebar', async ({ apiPage }) => {
    await test.step('Verify API page layout', async () => {
      await apiPage.verifyLayout();
    });

    await test.step('Verify API reference section is listed in sidebar', async () => {
      await apiPage.leftNav.verifySection({ name: 'API reference' });
    });

    await test.step('Verify key API classes are available in sidebar', async () => {
      const keyClasses = ['Browser', 'Page', 'Locator'];
      for (const className of keyClasses) {
        const classLink = apiPage.page.getByRole('link', { name: className });
        await expect(classLink.first(), `${className} class should be in API reference`).toBeVisible();
      }
    });
  });

  test('should navigate to Locator class documentation', async ({ apiPage }) => {
    await test.step('Navigate to Locator class page', async () => {
      await apiPage.goto('locator');
    });

    await test.step('Verify Locator class page URL and title', async () => {
      await expect(apiPage.page, 'Should be on Locator class page').toHaveURL('/docs/api/class-locator');
      await expect(apiPage.page, 'Page title should be correct for Locator class').toHaveTitle(/Locator.*Playwright/);
    });

    await test.step('Verify Locator class documentation content', async () => {
      await apiPage.verifyClassDocumentation({
        name: 'Locator',
        description: '',
        methods: []
      });
    });

    await test.step('Verify code examples are present', async () => {
      await apiPage.verifyCodeExamples();
    });
  });

  test('should navigate to Page class documentation', async ({ apiPage }) => {
    await test.step('Navigate to Page class page', async () => {
      await apiPage.goto('page');
    });

    await test.step('Verify Page class page URL', async () => {
      await expect(apiPage.page, 'Should be on Page class').toHaveURL('/docs/api/class-page');
    });

    await test.step('Verify Page class methods are documented', async () => {
      const pageClassDef = apiPage.getPageClass();
      await apiPage.verifyClassDocumentation(pageClassDef);
    });
  });

  test('should navigate to Browser class documentation', async ({ apiPage }) => {
    await test.step('Navigate to Browser class page', async () => {
      await apiPage.goto('browser');
    });

    await test.step('Verify Browser class page URL', async () => {
      await expect(apiPage.page, 'Should be on Browser class').toHaveURL('/docs/api/class-browser');
    });

    await test.step('Verify newPage method is documented', async () => {
      await apiPage.verifyMethodDocumentation({
        name: 'newPage',
        description: ''
      }, 'Browser');
    });
  });

  test('should navigate to main Playwright class documentation', async ({ apiPage }) => {
    await test.step('Verify Playwright class documentation content', async () => {
      const playwrightClassDef = apiPage.getPlaywrightClass();
      await apiPage.verifyClassDocumentation(playwrightClassDef);
    });
  });

  test('should maintain consistent navigation structure across API pages', async ({ apiPage }) => {
    const apiClasses = ['playwright', 'page', 'browser', 'locator'];

    for (const className of apiClasses) {
      await test.step(`Verify layout and sidebar on ${className} class page`, async () => {
        await apiPage.goto(className);
        await apiPage.verifyLayout();
        await apiPage.leftNav.verifySection({ name: 'API reference' });
      });
    }
  });
});