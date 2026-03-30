// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/api.fixture';

test.describe('API Reference Navigation', () => {
  test('should display correct API reference structure and sidebar', async ({ apiPage }) => {
    // Verify API page layout using facade method
    await apiPage.verifyLayout();
    
    // Verify key API classes are listed using component method
    await apiPage.leftNav.verifySection({ name: 'API reference' });
    
    // Verify main API classes are available
    const keyClasses = ['Browser', 'Page', 'Locator'];
    for (const className of keyClasses) {
      const classLink = apiPage.page.getByRole('link', { name: className });
      await expect(classLink.first(), `${className} class should be in API reference`).toBeVisible();
    }
  });

  test('should navigate to Locator class documentation', async ({ apiPage }) => {
    // Navigate to Locator class using page object method
    await apiPage.goto('locator');
    
    // Verify we're on the correct page
    await expect(apiPage.page, 'Should be on Locator class page').toHaveURL('/docs/api/class-locator');
    await expect(apiPage.page, 'Page title should be correct for Locator class').toHaveTitle(/Locator.*Playwright/);
    
    // Verify class documentation using built-in class definition with facade
    await apiPage.verifyClassDocumentation({
      name: 'Locator',
      description: '',
      methods: [] // Just verify class name presence
    });
    
    // Verify code examples are present
    await apiPage.verifyCodeExamples();
  });

  test('should navigate to Page class documentation', async ({ apiPage }) => {
    // Navigate to Page class using DTO pattern
    await apiPage.goto('page');
    
    // Verify page loaded correctly
    await expect(apiPage.page, 'Should be on Page class').toHaveURL('/docs/api/class-page');
    
    // Verify key methods are documented
    const pageClassDef = apiPage.getPageClass();
    await apiPage.verifyClassDocumentation(pageClassDef);
  });

  test('should navigate to Browser class documentation', async ({ apiPage }) => {
    await apiPage.goto('browser');
    
    await expect(apiPage.page, 'Should be on Browser class').toHaveURL('/docs/api/class-browser');
    
    // Verify key method is documented
    await apiPage.verifyMethodDocumentation({
      name: 'newPage',
      description: ''
    });
  });

  test('should navigate to main Playwright class documentation', async ({ apiPage }) => {
    // Already navigated by fixture, verify content
    const playwrightClassDef = apiPage.getPlaywrightClass();
    await apiPage.verifyClassDocumentation(playwrightClassDef);
  });

  test('should maintain consistent navigation structure across API pages', async ({ apiPage }) => {
    const apiClasses = ['playwright', 'page', 'browser', 'locator'];
    
    for (const className of apiClasses) {
      await apiPage.goto(className);
      
      // Verify consistent layout using facade method on each page
      await apiPage.verifyLayout();
      await apiPage.leftNav.verifySection({ name: 'API reference' });
    }
  });
});