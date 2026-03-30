// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/docs.fixture';

test.describe('Documentation Sidebar Navigation', () => {
  test('should display correct sidebar structure and sections', async ({ docsPage }) => {
    // Verify docs page layout
    await docsPage.verifyLayout();
    
    // Verify Getting Started section structure using built-in navigation data
    await docsPage.leftNav.verifySection(docsPage.leftNav.getGettingStartedSection());
    
    // Verify Playwright Test section structure
    await docsPage.leftNav.verifySection(docsPage.leftNav.getPlaywrightTestSection());
    
    // Verify Guides section structure  
    await docsPage.leftNav.verifySection(docsPage.leftNav.getGuidesSection());
  });

  test('should expand and collapse sidebar sections correctly', async ({ docsPage }) => {
    // Test section expansion/collapse using component methods
    await docsPage.leftNav.collapseSection('Playwright Test');
    await docsPage.leftNav.verifySectionState('Playwright Test', false);
    
    // Expand section and verify state
    await docsPage.leftNav.expandSection('Playwright Test');
    await docsPage.leftNav.verifySectionState('Playwright Test', true);
  });

  test('should navigate through Getting Started flow', async ({ docsPage }) => {
    // Navigate using the DTO pattern with navigation options
    await docsPage.leftNav.navigateTo({
      section: 'Getting Started',
      subsection: 'Writing tests'
    });
    
    // Verify navigation occurred and content is correct
    await expect(docsPage.page, 'Should navigate to writing tests').toHaveURL('/docs/writing-tests');
    await docsPage.verifyMainHeading('Writing tests');
    
    // Navigate to code generation
    await docsPage.leftNav.navigateTo({
      section: 'Getting Started', 
      subsection: 'Generating tests'
    });
    
    await expect(docsPage.page, 'Should navigate to code generation').toHaveURL('/docs/codegen-intro');
    await docsPage.verifyPageContent(['codegen', 'generating tests']);
    
    // Navigate back to installation
    await docsPage.leftNav.navigateTo({
      section: 'Getting Started',
      subsection: 'Installation'
    });
    
    await expect(docsPage.page, 'Should navigate to installation').toHaveURL('/docs/intro');
    await docsPage.verifyPageContent(['npm init playwright']);
  });

  test('should highlight current page in sidebar navigation', async ({ docsPage }) => {
    // Navigate to a specific page
    await docsPage.leftNav.navigateTo({
      section: 'Getting Started',
      subsection: 'Writing tests'
    });
    
    // Verify current page is highlighted (implementation depends on site design)
    await docsPage.leftNav.verifyCurrentHighlight('Writing tests');
  });
});