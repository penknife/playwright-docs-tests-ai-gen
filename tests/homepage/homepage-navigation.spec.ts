// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/homepage.fixture';

test.describe('Homepage Navigation', () => {
  test('should navigate to docs when Get Started is clicked', async ({ homePage }) => {
    // Use facade method to navigate to docs
    await homePage.clickGetStarted();
  });

  test('should open GitHub repository in new tab', async ({ homePage }) => {
    // Use component method for external link navigation  
    const newPage = await homePage.topNav.openGitHubRepository();
    await expect(newPage, 'GitHub repository should open in new tab').toHaveURL(/microsoft\/playwright/);
    await newPage.close();
  });

  test('should navigate to different language documentation', async ({ homePage }) => {
    // Test language-specific navigation using DTO pattern
    const languageTests = [
      { language: 'Node.js', expectedUrl: '/docs/intro' },
      { language: 'Python', expectedUrl: '/python/docs/intro' },
      { language: 'Java', expectedUrl: '/java/docs/intro' },
      { language: '.NET', expectedUrl: '/dotnet/docs/intro' }
    ];

    for (const languageTest of languageTests) {
      // Return to homepage for each test
      await homePage.goto();
      
      // Use top navigation component to switch languages
      await homePage.topNav.switchLanguage({ 
        language: languageTest.language as 'Node.js' | 'Python' | 'Java' | '.NET'
      });
      
      // Verify correct URL navigation
      await expect(homePage.page, `${languageTest.language} should navigate to correct docs`).toHaveURL(languageTest.expectedUrl);
    }
  });

  test('should navigate to main sections from homepage', async ({ homePage }) => {
    // Test navigation to different sections using facade pattern
    const sections: Array<'docs' | 'api' | 'community'> = ['docs', 'api', 'community'];
    
    for (const section of sections) {
      await homePage.goto();
      await homePage.navigateToSection(section);
      
      // Verify navigation occurred
      await expect(homePage.page, `Should navigate to ${section} section`).toHaveURL(new RegExp(`/${section}`));
    }
  });
});