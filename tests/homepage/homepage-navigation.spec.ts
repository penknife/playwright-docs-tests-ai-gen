// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/homepage.fixture';

test.describe('Homepage Navigation', () => {
  test('should navigate to docs when Get Started is clicked', async ({ homePage }) => {
    await test.step('Click Get Started button', async () => {
      await homePage.clickGetStarted();
    });
  });

  test('should open GitHub repository in new tab', async ({ homePage }) => {
    await test.step('Open GitHub repository link', async () => {
      const newPage = await homePage.topNav.openGitHubRepository();
      await expect(newPage, 'GitHub repository should open in new tab').toHaveURL(/microsoft\/playwright/);
      await newPage.close();
    });
  });

  test('should navigate to different language documentation', async ({ homePage }) => {
    const languageTests = [
      { language: 'Python', expectedUrl: '/python/' },
      { language: 'Java', expectedUrl: '/java/' },
      { language: '.NET', expectedUrl: '/dotnet/' },
      { language: 'Node.js', expectedUrl: 'https://playwright.dev/' }
    ];

    for (const languageTest of languageTests) {
      await test.step(`Switch to ${languageTest.language} and verify URL`, async () => {
        if (languageTest.language === 'Node.js') {
          await homePage.clearLanguagePreference();
        }
        await homePage.topNav.switchLanguage(languageTest.language as 'Node.js' | 'Python' | 'Java' | '.NET');
        await expect(homePage.page, `${languageTest.language} should navigate to correct docs`).toHaveURL(languageTest.expectedUrl);
      });
    }
  });

  test('should navigate to main sections from homepage', async ({ homePage }) => {
    const sections: Array<'docs' | 'api' | 'community'> = ['docs', 'api', 'community'];

    for (const section of sections) {
      await test.step(`Navigate to ${section} section and verify URL`, async () => {
        await homePage.goto();
        await homePage.navigateToSection(section);
        await expect(homePage.page, `Should navigate to ${section} section`).toHaveURL(new RegExp(`/${section}`));
      });
    }
  });
});