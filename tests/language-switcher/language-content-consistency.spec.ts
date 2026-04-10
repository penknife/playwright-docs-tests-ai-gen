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
      await test.step(`Verify docs structure for ${config.name}`, async () => {
        await languagePage.page.goto(config.introUrl);
        await languagePage.topNav.verifyNavigationItems(['Docs', 'API', 'Community']);
        await languagePage.leftNav.verifySection({ name: 'Getting Started' });
      });
    }
  });

  test('should maintain search functionality across all languages', async ({ languagePage }) => {
    for (const config of LANGUAGE_CONFIGS) {
      await test.step(`Verify search opens and closes on ${config.name} docs`, async () => {
        await languagePage.page.goto(config.introUrl);
        await languagePage.search.open();
        await languagePage.search.verifyModalOpen();
        await languagePage.search.close();
      });
    }
  });

  test('should persist language selection during docs navigation', async ({ languagePage }) => {
    await test.step('Navigate to Python intro page', async () => {
      await languagePage.page.goto('https://playwright.dev/python/docs/intro');
    });

    await test.step('Navigate to Writing tests within Python docs', async () => {
      await languagePage.leftNav.navigateTo({
        section: 'Getting Started',
        subsection: 'Writing tests'
      });
    });

    await test.step('Verify Python language and URL prefix are preserved', async () => {
      await expect(languagePage.page.getByRole('button', { name: 'Python' }),
        'Language should persist during navigation').toBeVisible();
      await expect(languagePage.page, 'URL should maintain Python prefix').toHaveURL('/python/docs/writing-tests');
    });
  });

  test('should have language-specific URLs throughout navigation', async ({ languagePage }) => {
    const languageUrlTests = LANGUAGE_CONFIGS.map(config => ({
      introUrl: config.introUrl,
      expectedUrlPattern: new RegExp(`${config.urlPrefix}/docs`)
    }));

    for (const urlTest of languageUrlTests) {
      await test.step(`Verify URL contains language prefix for ${urlTest.introUrl}`, async () => {
        await languagePage.page.goto(urlTest.introUrl);
        await expect(languagePage.page, 'URL should contain language prefix').toHaveURL(urlTest.expectedUrlPattern);
      });
    }
  });
});