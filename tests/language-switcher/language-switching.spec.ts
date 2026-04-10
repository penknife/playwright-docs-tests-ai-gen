// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/language-switcher.fixture';

test.describe('Language Switcher Functionality', () => {
  test('should display Node.js as the default language selection', async ({ languagePage }) => {
    await test.step('Verify top navigation is visible', async () => {
      await languagePage.topNav.verifyVisible();
    });

    await test.step('Verify Node.js is the current language', async () => {
      const currentLanguage = await languagePage.topNav.getCurrentLanguage();
      expect(currentLanguage, 'Node.js should be the default language').toContain('Node.js');
    });
  });

  test('should show all available languages in the language dropdown', async ({ languagePage }) => {
    await test.step('Verify all languages are available in the dropdown', async () => {
      await languagePage.topNav.verifyDropdownLanguages(['Node.js', 'Python', 'Java', '.NET']);
    });
  });

  test('should switch to Python documentation correctly', async ({ languagePage }) => {
    await test.step('Navigate to Python documentation', async () => {
      await languagePage.page.goto('https://playwright.dev/python/');
    });

    await test.step('Verify Python URL, language switcher and page content', async () => {
      await expect(languagePage.page, 'URL should contain python prefix').toHaveURL('/python/');
      await expect(languagePage.page.getByRole('button', { name: 'Python' }), 'Language switcher should show Python').toBeVisible();
      await expect(languagePage.page.getByText(/playwright for python/i), 'Should show Python documentation').toBeVisible();
    });

    await test.step('Verify navigation items are consistent', async () => {
      await languagePage.topNav.verifyNavigationItems(['Docs', 'API', 'Community']);
    });
  });

  test('should switch to Java documentation correctly', async ({ languagePage }) => {
    await test.step('Navigate to Java documentation', async () => {
      await languagePage.page.goto('https://playwright.dev/java/');
    });

    await test.step('Verify Java URL, language switcher and page content', async () => {
      await expect(languagePage.page, 'URL should contain java prefix').toHaveURL('/java/');
      await expect(languagePage.page.getByRole('button', { name: 'Java' }), 'Language switcher should show Java').toBeVisible();
      await expect(languagePage.page.getByText(/playwright for java/i), 'Should show Java documentation').toBeVisible();
    });
  });

  test('should switch to .NET documentation correctly', async ({ languagePage }) => {
    await test.step('Navigate to .NET documentation', async () => {
      await languagePage.page.goto('https://playwright.dev/dotnet/');
    });

    await test.step('Verify .NET URL, language switcher and page content', async () => {
      await expect(languagePage.page, 'URL should contain dotnet prefix').toHaveURL('/dotnet/');
      await expect(languagePage.page.getByRole('button', { name: '.NET' }), 'Language switcher should show .NET').toBeVisible();
      await expect(languagePage.page.getByText(/playwright for \.net/i), 'Should show .NET documentation').toBeVisible();
    });
  });

  test('should maintain consistent navigation across languages', async ({ languagePage }) => {
    const languageUrls = {
      'Node.js': '/',
      'Python': '/python/',
      'Java': '/java/',
      '.NET': '/dotnet/'
    };

    for (const [language, urlPrefix] of Object.entries(languageUrls)) {
      await test.step(`Verify navigation structure and language switcher for ${language}`, async () => {
        await languagePage.page.goto(`https://playwright.dev${urlPrefix}`);
        await languagePage.topNav.verifyNavigationItems(['Docs', 'API', 'Community']);
        await expect(languagePage.page.getByRole('button', { name: language }),
          `${language} should be shown in language switcher`).toBeVisible();
      });
    }
  });
});