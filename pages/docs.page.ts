import { Page, Locator, expect } from '@playwright/test';
import { TopNavigation } from './components/top-navigation';
import { LeftNavigationPanel } from './components/left-navigation-panel';
import { SearchModal } from './components/search-modal';
import { LanguageSwitcher } from './components/language-switcher';

export interface BreadcrumbItem {
  text: string;
  href?: string;
}

export interface ContentSection {
  heading: string;
  level: number;
}

export class DocsPage {
  readonly page: Page;
  readonly topNav: TopNavigation;
  readonly leftNav: LeftNavigationPanel;
  readonly search: SearchModal;
  readonly languageSwitcher: LanguageSwitcher;
  
  // Content area locators
  readonly contentArea: Locator;
  readonly mainHeading: Locator;
  readonly breadcrumbs: Locator;
  readonly tableOfContents: Locator;
  readonly codeBlocks: Locator;
  
  // Navigation elements
  readonly prevPageLink: Locator;
  readonly nextPageLink: Locator;
  readonly editPageLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topNav = new TopNavigation(page);
    this.leftNav = new LeftNavigationPanel(page);
    this.search = new SearchModal(page);
    this.languageSwitcher = new LanguageSwitcher(page);
    
    // Content area
    this.contentArea = page.getByRole('main');
    this.mainHeading = page.getByRole('heading', { level: 1 });
    this.breadcrumbs = page.getByRole('navigation', { name: 'Breadcrumbs' });
    this.tableOfContents = page.getByRole('navigation', { name: 'Table of contents' });
    this.codeBlocks = page.locator('pre code');
    
    // Page navigation
    this.prevPageLink = page.getByRole('link', { name: /previous/i });
    this.nextPageLink = page.getByRole('link', { name: /next/i });
    this.editPageLink = page.getByRole('link', { name: /edit.*page/i });
  }

  async goto(path: string = ''): Promise<void> {
    const url = path ? `https://playwright.dev/docs/${path}` : 'https://playwright.dev/docs/intro';
    await this.page.goto(url);
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page, 'Should be on docs page').toHaveURL(/\/docs/);
    await expect(this.contentArea, 'Main content area should be visible').toBeVisible();
  }

  async verifyLayout(): Promise<void> {
    // Verify main layout components are present
    await this.topNav.verifyVisible();
    await this.leftNav.verifyVisible();
    await expect(this.contentArea, 'Content area should be visible').toBeVisible();
  }

  async verifyBreadcrumbs(expectedBreadcrumbs: BreadcrumbItem[]): Promise<void> {
    await expect(this.breadcrumbs, 'Breadcrumbs should be visible').toBeVisible();
    
    for (const breadcrumb of expectedBreadcrumbs) {
      if (breadcrumb.href) {
        // First try to find a link by text name; if not found, find by href attribute
        const linkByName = this.breadcrumbs.getByRole('link', { name: new RegExp(breadcrumb.text, 'i') });
        const linkByHref = this.breadcrumbs.locator(`a[href="${breadcrumb.href}"]`);
        const textInBreadcrumbs = this.breadcrumbs.locator('li').filter({ hasText: breadcrumb.text });
        
        const linkByNameCount = await linkByName.count();
        const linkByHrefCount = await linkByHref.count();
        
        if (linkByNameCount > 0) {
          await expect(linkByName.first(), `Breadcrumb link "${breadcrumb.text}" should be visible`).toBeVisible();
        } else if (linkByHrefCount > 0) {
          await expect(linkByHref.first(), `Breadcrumb link to "${breadcrumb.href}" should be visible`).toBeVisible();
        } else {
          await expect(textInBreadcrumbs.first(), `Breadcrumb "${breadcrumb.text}" should be visible`).toBeVisible();
        }
      } else {
        // Current page breadcrumb (usually not a link)
        await expect(this.breadcrumbs, `Breadcrumb should contain "${breadcrumb.text}"`).toContainText(breadcrumb.text);
      }
    }
  }

  async verifyMainHeading(expectedHeading: string): Promise<void> {
    await expect(this.mainHeading, `Main heading should be "${expectedHeading}"`).toHaveText(expectedHeading);
  }

  async verifyTableOfContents(expectedSections: ContentSection[]): Promise<void> {
    if (expectedSections.length === 0) return;
    
    await expect(this.tableOfContents, 'Table of contents should be visible').toBeVisible();
    
    for (const section of expectedSections) {
      const tocLink = this.tableOfContents.getByRole('link', { name: section.heading });
      await expect(tocLink, `TOC should contain "${section.heading}"`).toBeVisible();
    }
  }

  async verifyCodeBlocks(): Promise<void> {
    const codeBlockCount = await this.codeBlocks.count();
    
    if (codeBlockCount > 0) {
      // Verify first code block is visible
      await expect(this.codeBlocks.first(), 'Code blocks should be visible').toBeVisible();
      
      // Check for syntax highlighting
      const hasHighlighting = await this.codeBlocks.first().locator('[class*="token"], [class*="highlight"]').count() > 0;
      expect(hasHighlighting, 'Code blocks should have syntax highlighting').toBe(true);
    }
  }

  async clickTableOfContentsItem(heading: string): Promise<void> {
    const tocLink = this.tableOfContents.getByRole('link', { name: heading });
    await tocLink.click();
    
    // Verify the corresponding heading is now in view
    const targetHeading = this.page.getByRole('heading', { name: heading });
    await expect(targetHeading, `${heading} should be in viewport`).toBeInViewport();
  }

  async navigateToNextPage(): Promise<void> {
    if (await this.nextPageLink.isVisible()) {
      const nextPageTitle = await this.nextPageLink.textContent();
      await this.nextPageLink.click();
      
      // Verify navigation occurred
      await this.verifyPageLoaded();
      console.log(`Navigated to next page: ${nextPageTitle}`);
    } else {
      throw new Error('Next page link is not available');
    }
  }

  async navigateToPreviousPage(): Promise<void> {
    if (await this.prevPageLink.isVisible()) {
      const prevPageTitle = await this.prevPageLink.textContent();
      await this.prevPageLink.click();
      
      // Verify navigation occurred
      await this.verifyPageLoaded();
      console.log(`Navigated to previous page: ${prevPageTitle}`);
    } else {
      throw new Error('Previous page link is not available');
    }
  }

  async verifyEditPageLink(): Promise<void> {
    await expect(this.editPageLink, 'Edit page link should be visible').toBeVisible();
    
    // Verify it links to GitHub
    const href = await this.editPageLink.getAttribute('href');
    expect(href, 'Edit page link should point to GitHub').toContain('github.com');
  }

  async searchInPage(query: string): Promise<void> {
    await this.page.press('body', 'Control+f');
    await this.page.keyboard.type(query);
    
    // Wait for search highlighting
    await this.page.waitForTimeout(100);
  }

  async verifyLanguageSwitcherPresence(): Promise<void> {
    // Check if language switcher is present (only on some pages)
    const hasLanguageSwitcher = await this.page.getByRole('tablist', { name: /language/i }).isVisible();
    
    if (hasLanguageSwitcher) {
      await this.languageSwitcher.verifyVisible();
    }
  }

  async navigateToGettingStarted(): Promise<void> {
    await this.leftNav.navigateTo({
      section: 'Getting Started',
      subsection: 'Installation'
    });
    
    await expect(this.page, 'Should navigate to installation page').toHaveURL(/\/docs\/intro/);
  }

  async navigateToPlaywrightTest(): Promise<void> {
    await this.leftNav.navigateTo({
      section: 'Playwright Test',
      subsection: 'Configuration'
    });
    
    await expect(this.page, 'Should navigate to configuration page').toHaveURL(/\/docs\/test-configuration/);
  }

  async verifyResponsiveDesign(): Promise<void> {
    // Test mobile viewport - sidebar should be collapsed
    await this.page.setViewportSize({ width: 375, height: 667 });
    
    // On mobile, left nav might be hidden or collapsed
    const isMobileNavVisible = await this.leftNav.sidebar.isVisible();
    console.log(`Mobile navigation visible: ${isMobileNavVisible}`);
    
    // Verify content is still accessible
    await expect(this.contentArea, 'Content should be visible on mobile').toBeVisible();
    
    // Reset to desktop
    await this.page.setViewportSize({ width: 1920, height: 1080 });
    await this.leftNav.verifyVisible();
  }

  async copyCodeBlock(index: number = 0): Promise<string> {
    const codeBlock = this.codeBlocks.nth(index);
    await expect(codeBlock, `Code block ${index} should be visible`).toBeVisible();
    
    // Look for copy button
    const copyButton = this.page.locator(`pre:has(code) button`, { hasText: /copy/i }).nth(index);
    
    if (await copyButton.isVisible()) {
      await copyButton.click();
      console.log(`Copied code block ${index}`);
    }
    
    return await codeBlock.textContent() || '';
  }

  async verifyPageContent(expectedContent: string[]): Promise<void> {
    const pageText = await this.contentArea.textContent();
    
    for (const content of expectedContent) {
      expect(pageText, `Page should contain: ${content}`).toContain(content);
    }
  }

  async scrollToSection(sectionHeading: string): Promise<void> {
    const section = this.page.getByRole('heading', { name: sectionHeading });
    await section.scrollIntoViewIfNeeded();
    await expect(section, `${sectionHeading} should be in viewport`).toBeInViewport();
  }
}