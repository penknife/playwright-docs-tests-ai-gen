// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/docs.fixture';

test.describe('Documentation Content Navigation', () => {
  test('should display correct breadcrumbs and enable navigation', async ({ docsPage }) => {
    // Verify breadcrumbs structure using DTO pattern
    await docsPage.verifyBreadcrumbs([
      { text: 'Home', href: '/' },
      { text: 'Getting Started', href: '/docs' },
      { text: 'Installation' } // Current page, no href
    ]);
    
    // Test breadcrumb navigation
    await docsPage.topNav.navigateTo({ section: 'docs' });
    await expect(docsPage.page, 'Should navigate to docs home').toHaveURL(/\/docs/);
  });

  test('should navigate between documentation sections correctly', async ({ docsPage }) => {
    // Test navigation to different doc pages using facade pattern
    const docPages = [
      { path: 'writing-tests', expectedHeading: 'Writing tests', expectedContent: ['test', 'playwright'] },
      { path: 'codegen-intro', expectedHeading: 'Generating tests', expectedContent: ['codegen', 'generating'] },
      { path: 'test-configuration', expectedHeading: 'Configuration', expectedContent: ['playwright.config', 'configuration'] }
    ];

    for (const docPage of docPages) {
      // Navigate to page
      await docsPage.goto(docPage.path);
      
      // Verify page loaded correctly
      await expect(docsPage.page, `Should be on ${docPage.path} page`).toHaveURL(`/docs/${docPage.path}`);
      await docsPage.verifyMainHeading(docPage.expectedHeading);
      await docsPage.verifyPageContent(docPage.expectedContent);
      
      // Verify page title updated
      await expect(docsPage.page, `Page title should contain ${docPage.expectedHeading}`).toHaveTitle(new RegExp(docPage.expectedHeading));
    }
  });

  test('should navigate through Playwright Test section', async ({ docsPage }) => {
    // Test deep navigation using page object methods
    await docsPage.navigateToPlaywrightTest();
    await docsPage.verifyPageContent(['configuration', 'playwright.config']);
    
    // Navigate to fixtures page
    await docsPage.leftNav.navigateTo({
      section: 'Playwright Test',
      subsection: 'Fixtures'
    });
    
    await expect(docsPage.page, 'Should navigate to fixtures page').toHaveURL('/docs/test-fixtures');
    await docsPage.verifyPageContent(['test.extend', 'fixtures']);
    
    // Navigate to reporters page
    await docsPage.leftNav.navigateTo({
      section: 'Playwright Test',
      subsection: 'Reporters'
    });
    
    await expect(docsPage.page, 'Should navigate to reporters page').toHaveURL('/docs/test-reporters');
    await docsPage.verifyPageContent(['reporters']);
  });

  test('should maintain consistent layout across all doc pages', async ({ docsPage }) => {
    const testPages = ['writing-tests', 'test-configuration', 'test-fixtures'];
    
    for (const page of testPages) {
      await docsPage.goto(page);
      
      // Verify consistent layout using component methods
      await docsPage.verifyLayout();
      
      // Verify sidebar remains consistent
      await docsPage.leftNav.verifySection(docsPage.leftNav.getPlaywrightTestSection());
    }
  });
});