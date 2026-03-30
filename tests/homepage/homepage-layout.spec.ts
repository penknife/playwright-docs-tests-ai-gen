// spec: specs/playwright-docs-comprehensive-test-plan.md  
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/homepage.fixture';

test.describe('Homepage Layout', () => {
  test('should display hero section with correct content', async ({ homePage }) => {
    // Verify page loads correctly
    await expect(homePage.page, 'Page title should contain Playwright').toHaveTitle(/Playwright/);
    
    // Verify hero section content using facade pattern
    await homePage.verifyHeroSection(homePage.getDefaultHeroContent());
    
    // Verify navigation is present
    await homePage.topNav.verifyVisible();
    await homePage.topNav.verifyNavigationItems(['Docs', 'API', 'Community']);
  });

  test('should display feature cards with expected content', async ({ homePage }) => {
    // Scroll to features section
    await homePage.scrollToFeatures();
    
    // Verify feature cards using expected data
    await homePage.verifyFeatureCards(homePage.getExpectedFeatures());
  });

  test('should display quick start installation section', async ({ homePage }) => {
    // Scroll to quick start section
    await homePage.scrollToQuickStart();
    
    // Verify quick start content
    await homePage.verifyQuickStartSection();
  });

  test('should be responsive across different viewport sizes', async ({ homePage }) => {
    // Test responsive design
    await homePage.verifyResponsiveDesign();
  });

  test('should meet basic accessibility requirements', async ({ homePage }) => {
    // Verify accessibility features
    await homePage.verifyAccessibility();
  });
});