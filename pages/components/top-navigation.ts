import { Page, Locator } from '@playwright/test';

export interface NavigationOptions {
  section: 'docs' | 'api' | 'community';
}

export class TopNavigation {
  readonly page: Page;
  readonly logoLink: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly communityLink: Locator;
  readonly languageSwitcher: Locator;
  readonly githubLink: Locator;
  readonly discordLink: Locator;
  readonly themeToggle: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logoLink = page.getByRole('link', { name: /Playwright logo Playwright/ });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.apiLink = page.getByRole('link', { name: 'API' });
    this.communityLink = page.getByRole('link', { name: 'Community' });
    this.languageSwitcher = page.getByRole('button', { name: /^(Node\.js|Python|Java|\.NET)$/ });
    this.githubLink = page.getByRole('link', { name: 'GitHub repository' });
    this.discordLink = page.getByRole('link', { name: 'Discord server' });
    this.themeToggle = page.getByRole('button', { name: /Switch between dark and light mode/ });
    this.searchButton = page.getByRole('button', { name: /Search/ });
  }

  async navigateTo(options: NavigationOptions): Promise<void> {
    switch (options.section) {
      case 'docs':
        await this.docsLink.click();
        break;
      case 'api':
        await this.apiLink.click();
        break;
      case 'community':
        await this.communityLink.click();
        break;
      default:
        throw new Error(`Unknown navigation section: ${options.section}`);
    }
  }

  async searchFor(query: string): Promise<void> {
    await this.searchButton.click();
    await this.page.getByRole('searchbox', { name: 'Search' }).fill(query);
  }

  async getCurrentLanguage(): Promise<string> {
    return await this.languageSwitcher.textContent() || '';
  }

  async switchLanguage(language: 'Node.js' | 'Python' | 'Java' | '.NET'): Promise<void> {
    await this.languageSwitcher.click();
    await this.page.getByRole('link', { name: language }).click();
  }

  async openGitHubRepository(): Promise<import('@playwright/test').Page> {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.getByRole('link', { name: /star.*microsoft.*playwright/i }).click(),
    ]);
    
    return newPage;
  }

  async verifyVisible(): Promise<void> {
    const { expect } = await import('@playwright/test');
    await expect(this.logoLink, 'Top navigation logo should be visible').toBeVisible();
    await expect(this.docsLink, 'Docs link should be visible').toBeVisible();
    await expect(this.apiLink, 'API link should be visible').toBeVisible();
    await expect(this.communityLink, 'Community link should be visible').toBeVisible();
  }

  async verifyNavigationItems(expectedItems: string[]): Promise<void> {
    const { expect } = await import('@playwright/test');
    
    for (const item of expectedItems) {
      switch (item) {
        case 'Docs':
          await expect(this.docsLink, 'Docs link should be visible').toBeVisible();
          break;
        case 'API':
          await expect(this.apiLink, 'API link should be visible').toBeVisible();
          break;
        case 'Community':
          await expect(this.communityLink, 'Community link should be visible').toBeVisible();
          break;
      }
    }
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }
}