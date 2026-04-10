import { Page, Locator, expect } from '@playwright/test';
import { TopNavigation } from './components/top-navigation';
import { SearchModal } from './components/search-modal';

export interface HeroSection {
  title: string;
  subtitle: string;
  ctaButton: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  learnMoreLink?: string;
}

export class HomePage {
  readonly page: Page;
  readonly topNav: TopNavigation;
  readonly search: SearchModal;
  
  // Hero section locators
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly getStartedButton: Locator;
  
  // Feature sections
  readonly featuresSection: Locator;
  readonly featureCards: Locator;
  
  // Quick start section
  readonly quickStartSection: Locator;
  readonly installationSteps: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topNav = new TopNavigation(page);
    this.search = new SearchModal(page);
    
    // Hero section
    this.heroSection = page.locator('header.hero').first();
    this.heroTitle = page.getByRole('heading', { level: 1 }).first();
    this.heroSubtitle = this.heroSection.locator('p').first();
    this.getStartedButton = page.getByRole('link', { name: /get started/i });
    
    // Features
    this.featuresSection = page.locator('main section').first();
    this.featureCards = page.locator('main section[class*="featureSection"]');
    
    // Quick start
    this.quickStartSection = page.locator('main section').first();
    this.installationSteps = page.locator('main section code');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://playwright.dev/');
    await this.verifyPageLoaded();
  }

  async clearLanguagePreference(): Promise<void> {
    // Site stores language preference in localStorage; clear it so root URL
    // doesn't redirect back to a language subsite
    await this.page.evaluate(() => localStorage.removeItem('docusaurus.tab.programming-language'));
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page, 'Should be on Playwright homepage').toHaveURL(/playwright\.dev/);
    await expect(this.page, 'Page should have correct title').toHaveTitle(/Playwright/);
  }

  async verifyHeroSection(expectedHero: HeroSection): Promise<void> {
    await expect(this.heroSection, 'Hero section should be visible').toBeVisible();
    
    // Verify hero title contains expected text (flexible matching)
    await expect(this.heroTitle, `Hero title should contain: ${expectedHero.title}`).toContainText(expectedHero.title);
    
    // Verify subtitle if provided
    if (expectedHero.subtitle) {
      await expect(this.heroSubtitle, `Hero subtitle should contain: ${expectedHero.subtitle}`).toContainText(expectedHero.subtitle);
    }
    
    // Verify CTA button
    await expect(this.getStartedButton, `Get started button should be visible`).toBeVisible();
    await expect(this.getStartedButton, `Button should contain: ${expectedHero.ctaButton}`).toContainText(expectedHero.ctaButton);
  }

  async clickGetStarted(): Promise<void> {
    await this.getStartedButton.click();
    
    // Verify navigation to getting started page
    await expect(this.page, 'Should navigate to getting started page').toHaveURL(/\/docs\/intro/);
  }

  async verifyFeatureCards(expectedFeatures: FeatureCard[]): Promise<void> {
    await expect(this.featuresSection, 'Features section should be visible').toBeVisible();
    
    const cardCount = await this.featureCards.count();
    expect(cardCount, `Should have ${expectedFeatures.length} feature cards`).toBeGreaterThanOrEqual(expectedFeatures.length);
    
    for (let i = 0; i < expectedFeatures.length; i++) {
      const feature = expectedFeatures[i];
      const card = this.featureCards.nth(i);
      
      await expect(card, `Feature card ${i + 1} should be visible`).toBeVisible();
      await expect(card, `Feature card should contain title: ${feature.title}`).toContainText(feature.title);
      await expect(card, `Feature card should contain description: ${feature.description}`).toContainText(feature.description);
      
      if (feature.learnMoreLink) {
        const learnMoreLink = card.getByRole('link', { name: /learn more/i });
        await expect(learnMoreLink, `Learn more link should be present`).toBeVisible();
      }
    }
  }

  async verifyQuickStartSection(): Promise<void> {
    await expect(this.quickStartSection, 'Quick start section should be visible').toBeVisible();
    
    // Verify installation steps are present
    const stepsCount = await this.installationSteps.count();
    expect(stepsCount, 'Should have installation steps').toBeGreaterThan(0);
    
    // Verify npm install command is shown
    const hasNpmInstall = await this.page.getByText('npm init playwright').isVisible();
    expect(hasNpmInstall, 'Should show npm installation command').toBe(true);
  }

  async verifyResponsiveDesign(): Promise<void> {
    // Test mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.verifyPageLoaded();
    
    // Verify hero section is still visible and readable
    await expect(this.heroSection, 'Hero section should be visible on mobile').toBeVisible();
    
    // Test tablet viewport
    await this.page.setViewportSize({ width: 768, height: 1024 });
    await this.verifyPageLoaded();
    
    // Test desktop viewport
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.verifyPageLoaded();
  }

  async verifyAccessibility(): Promise<void> {
    // Verify main heading has proper hierarchy (native h1 has implicit heading role)
    await expect(this.heroTitle, 'Main heading should be visible').toBeVisible();
    await expect(this.heroTitle, 'Main heading should have text').not.toBeEmpty();
    
    // Verify CTA button is accessible
    await this.getStartedButton.focus();
    await expect(this.getStartedButton, 'Get started button should be focusable').toBeFocused();
  }

  async navigateToSection(section: 'docs' | 'api' | 'community'): Promise<void> {
    switch (section) {
      case 'docs':
        await this.topNav.navigateTo({ section: 'docs' });
        break;
      case 'api':
        await this.topNav.navigateTo({ section: 'api' });
        break;
      case 'community':
        await this.topNav.navigateTo({ section: 'community' });
        break;
    }
  }

  getDefaultHeroContent(): HeroSection {
    return {
      title: 'Playwright',
      subtitle: 'One API to drive Chromium, Firefox, and WebKit',
      ctaButton: 'Get started'
    };
  }

  getExpectedFeatures(): FeatureCard[] {
    return [
      {
        title: 'Built for testing',
        description: 'Auto-wait'
      },
      {
        title: 'Built for AI agents',
        description: 'Accessibility snapshots'
      },
      {
        title: 'Powerful tooling',
        description: 'Test generator'
      }
    ];
  }

  async scrollToFeatures(): Promise<void> {
    await this.featuresSection.scrollIntoViewIfNeeded();
    await expect(this.featuresSection, 'Features section should be in viewport').toBeInViewport();
  }

  async scrollToQuickStart(): Promise<void> {
    await this.quickStartSection.scrollIntoViewIfNeeded();
    await expect(this.quickStartSection, 'Quick start section should be in viewport').toBeInViewport();
  }
}