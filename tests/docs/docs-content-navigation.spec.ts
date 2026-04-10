// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/docs.fixture';

test.describe('Documentation Content Navigation', () => {
  test('should display correct breadcrumbs and enable navigation', async ({ docsPage }) => {
    await test.step('Verify breadcrumbs structure', async () => {
      await docsPage.verifyBreadcrumbs([
        { text: 'Home', href: '/' },
        { text: 'Getting Started', href: '/docs' },
        { text: 'Installation' }
      ]);
    });

    await test.step('Navigate via breadcrumb and verify docs home loads', async () => {
      await docsPage.topNav.navigateTo({ section: 'docs' });
      await expect(docsPage.page, 'Should navigate to docs home').toHaveURL(/\/docs/);
    });
  });

  test('should navigate between documentation sections correctly', async ({ docsPage }) => {
    const docPages = [
      { path: 'writing-tests', expectedHeading: 'Writing tests', expectedContent: ['test', 'playwright'] },
      { path: 'codegen-intro', expectedHeading: 'Generating tests', expectedContent: ['codegen', 'generating'] },
      { path: 'test-configuration', expectedHeading: 'Configuration', expectedContent: ['playwright.config', 'configuration'] }
    ];

    for (const docPage of docPages) {
      await test.step(`Navigate to ${docPage.path} and verify content`, async () => {
        await docsPage.goto(docPage.path);
        await expect(docsPage.page, `Should be on ${docPage.path} page`).toHaveURL(`/docs/${docPage.path}`);
        await docsPage.verifyMainHeading(docPage.expectedHeading);
        await docsPage.verifyPageContent(docPage.expectedContent);
        await expect(docsPage.page, `Page title should contain ${docPage.expectedHeading}`).toHaveTitle(new RegExp(docPage.expectedHeading));
      });
    }
  });

  test('should navigate through Playwright Test section', async ({ docsPage }) => {
    await test.step('Navigate to Playwright Test section and verify configuration content', async () => {
      await docsPage.navigateToPlaywrightTest();
      await docsPage.verifyPageContent(['configuration', 'playwright.config']);
    });

    await test.step('Navigate to fixtures page and verify content', async () => {
      await docsPage.goto('test-fixtures');
      await expect(docsPage.page, 'Should navigate to fixtures page').toHaveURL('/docs/test-fixtures');
      await docsPage.verifyPageContent(['test.extend', 'fixtures']);
    });

    await test.step('Navigate to reporters page and verify content', async () => {
      await docsPage.goto('test-reporters');
      await expect(docsPage.page, 'Should navigate to reporters page').toHaveURL('/docs/test-reporters');
      await docsPage.verifyPageContent(['reporters']);
    });
  });

  test('should maintain consistent layout across all doc pages', async ({ docsPage }) => {
    const testPages = ['writing-tests', 'test-configuration', 'test-fixtures'];

    for (const page of testPages) {
      await test.step(`Verify layout is consistent on ${page}`, async () => {
        await docsPage.goto(page);
        await docsPage.verifyLayout();
        await docsPage.leftNav.verifySection(docsPage.leftNav.getPlaywrightTestSection());
      });
    }
  });
});