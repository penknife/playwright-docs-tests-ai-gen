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
    this.apiLink = page.getByRole('link', { name: 'API', exact: true });
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
    // Open the dropdown by clicking the language trigger link (uses aria-haspopup role)
    await this.languageSwitcher.click();
    // The dropdown links are data-language-prefix links in a dropdown
    const dropdownLink = this.page.locator(`a.dropdown__link`).filter({ hasText: new RegExp(`^${language.replace('.', '\\.')}$`) });
    await dropdownLink.waitFor({ state: 'visible' });
    await dropdownLink.click();
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

  async verifyDropdownLanguages(expectedLanguages: string[]): Promise<void> {
    const { expect } = await import('@playwright/test');
    // Open the dropdown
    await this.languageSwitcher.click();
    for (const language of expectedLanguages) {
      const dropdownLink = this.page.locator('a.dropdown__link').filter({
        hasText: new RegExp(`^${language.replace('.', '\\.')}$`)
      });
      await expect(dropdownLink, `${language} should be available in dropdown`).toBeVisible();
    }
    // Close the dropdown
    await this.page.keyboard.press('Escape');
  }

  async toggleTheme(): Promise<void> {
    await this.themeToggle.click();
  }
}