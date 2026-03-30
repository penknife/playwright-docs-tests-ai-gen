// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/language-switcher.fixture';

interface LanguageTestConfig {
  name: string;
  introUrl: string;
  urlPrefix: string;
}

const LANGUAGE_CONFIGS: LanguageTestConfig[] = [
  { name: 'Node.js', introUrl: 'https://playwright.dev/docs/intro', urlPrefix: '' },
  { name: 'Python', introUrl: 'https://playwright.dev/python/docs/intro', urlPrefix: '/python' },
  { name: 'Java', introUrl: 'https://playwright.dev/java/docs/intro', urlPrefix: '/java' },
  { name: '.NET', introUrl: 'https://playwright.dev/dotnet/docs/intro', urlPrefix: '/dotnet' }
];

test.describe('Language Content Consistency', () => {
  test('should have equivalent documentation structure for all languages', async ({ languagePage }) => {
    for (const config of LANGUAGE_CONFIGS) {
      // Navigate to each language's documentation
      await languagePage.page.goto(config.introUrl);
      
      // Verify consistent navigation structure using component methods
      await languagePage.topNav.verifyNavigationItems(['Docs', 'API', 'Community']);
      
      // Verify Getting Started section exists in sidebar
      await languagePage.leftNav.verifySection({ name: 'Getting Started' });
    }
  });

  test('should maintain search functionality across all languages', async ({ languagePage }) => {
    for (const config of LANGUAGE_CONFIGS) {
      await languagePage.page.goto(config.introUrl);
      
      // Test search works in each language using component method
      await languagePage.search.open();
      await languagePage.search.verifyModalOpen();
      await languagePage.search.close();
    }
  });

  test('should persist language selection during docs navigation', async ({ languagePage }) => {
    // Start with Python documentation
    await languagePage.page.goto('https://playwright.dev/python/docs/intro');
    
    // Navigate to another section within Python docs
    await languagePage.leftNav.navigateTo({
      section: 'Getting Started',
      subsection: 'Writing tests'
    });
    
    // Verify Python language is still selected
    await expect(languagePage.page.getByRole('button', { name: 'Python' }), 
      'Language should persist during navigation').toBeVisible();
    
    // Verify URL maintains language prefix
    await expect(languagePage.page, 'URL should maintain Python prefix').toHaveURL('/python/docs/writing-tests');
  });

  test('should have language-specific URLs throughout navigation', async ({ languagePage }) => {
    const languageUrlTests = LANGUAGE_CONFIGS.map(config => ({
      introUrl: config.introUrl,
      expectedUrlPattern: new RegExp(`${config.urlPrefix}/docs`)
    }));

    for (const test of languageUrlTests) {
      await languagePage.page.goto(test.introUrl);
      await expect(languagePage.page, 'URL should contain language prefix').toHaveURL(test.expectedUrlPattern);
    }
  });
});