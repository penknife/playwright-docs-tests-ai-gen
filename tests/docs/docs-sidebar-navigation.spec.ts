// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/docs.fixture';

test.describe('Documentation Sidebar Navigation', () => {
  test('should display correct sidebar structure and sections', async ({ docsPage }) => {
    await test.step('Verify basic page layout', async () => {
      await docsPage.verifyLayout();
    });

    await test.step('Verify Getting Started section structure', async () => {
      await docsPage.leftNav.verifySection(docsPage.leftNav.getGettingStartedSection());
    });

    await test.step('Verify Playwright Test section structure', async () => {
      await docsPage.leftNav.verifySection(docsPage.leftNav.getPlaywrightTestSection());
    });

    await test.step('Verify Guides section structure', async () => {
      await docsPage.leftNav.verifySection(docsPage.leftNav.getGuidesSection());
    });
  });

  test('should expand and collapse sidebar sections correctly', async ({ docsPage }) => {
    await test.step('Collapse Playwright Test section and verify it is collapsed', async () => {
      await docsPage.leftNav.collapseSection('Playwright Test');
      await docsPage.leftNav.verifySectionState('Playwright Test', false);
    });

    await test.step('Expand Playwright Test section and verify it is expanded', async () => {
      await docsPage.leftNav.expandSection('Playwright Test');
      await docsPage.leftNav.verifySectionState('Playwright Test', true);
    });
  });

  test('should navigate through Getting Started flow', async ({ docsPage }) => {
    await test.step('Navigate to Writing tests and verify page content', async () => {
      await docsPage.leftNav.navigateTo({
        section: 'Getting Started',
        subsection: 'Writing tests'
      });
      await expect(docsPage.page, 'Should navigate to writing tests').toHaveURL('/docs/writing-tests');
      await docsPage.verifyMainHeading('Writing tests');
    });

    await test.step('Navigate to Generating tests and verify page content', async () => {
      await docsPage.leftNav.navigateTo({
        section: 'Getting Started',
        subsection: 'Generating tests'
      });
      await expect(docsPage.page, 'Should navigate to code generation').toHaveURL('/docs/codegen-intro');
      await docsPage.verifyPageContent(['codegen', 'generating tests']);
    });

    await test.step('Navigate back to Installation and verify page content', async () => {
      await docsPage.leftNav.navigateTo({
        section: 'Getting Started',
        subsection: 'Installation'
      });
      await expect(docsPage.page, 'Should navigate to installation').toHaveURL('/docs/intro');
      await docsPage.verifyPageContent(['npm init playwright']);
    });
  });

  test('should highlight current page in sidebar navigation', async ({ docsPage }) => {
    await test.step('Navigate to Writing tests page', async () => {
      await docsPage.leftNav.navigateTo({
        section: 'Getting Started',
        subsection: 'Writing tests'
      });
    });

    await test.step('Verify current page is highlighted in sidebar', async () => {
      await docsPage.leftNav.verifyCurrentHighlight('Writing tests');
    });
  });
});