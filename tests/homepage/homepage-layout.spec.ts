// spec: specs/playwright-docs-comprehensive-test-plan.md  
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/homepage.fixture';

test.describe('Homepage Layout', () => {
  test('should display hero section with correct content', async ({ homePage }) => {
    await test.step('Verify page title contains Playwright', async () => {
      await expect(homePage.page, 'Page title should contain Playwright').toHaveTitle(/Playwright/);
    });

    await test.step('Verify hero section content', async () => {
      await homePage.verifyHeroSection(homePage.getDefaultHeroContent());
    });

    await test.step('Verify top navigation is visible with correct items', async () => {
      await homePage.topNav.verifyVisible();
      await homePage.topNav.verifyNavigationItems(['Docs', 'API', 'Community']);
    });
  });

  test('should display feature cards with expected content', async ({ homePage }) => {
    await test.step('Scroll to features section', async () => {
      await homePage.scrollToFeatures();
    });

    await test.step('Verify feature cards are shown with expected content', async () => {
      await homePage.verifyFeatureCards(homePage.getExpectedFeatures());
    });
  });

  test('should display quick start installation section', async ({ homePage }) => {
    await test.step('Scroll to quick start section', async () => {
      await homePage.scrollToQuickStart();
    });

    await test.step('Verify quick start content is displayed', async () => {
      await homePage.verifyQuickStartSection();
    });
  });

  test('should be responsive across different viewport sizes', async ({ homePage }) => {
    await test.step('Verify responsive design across viewport sizes', async () => {
      await homePage.verifyResponsiveDesign();
    });
  });

  test('should meet basic accessibility requirements', async ({ homePage }) => {
    await test.step('Verify basic accessibility requirements', async () => {
      await homePage.verifyAccessibility();
    });
  });
});