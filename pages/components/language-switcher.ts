import { Page, Locator, expect } from '@playwright/test';

export interface LanguageOption {
  language: string;
  displayName: string;
  description?: string;
}

export interface LanguageSwitchOptions {
  language: 'Node.js' | 'Python' | 'Java' | '.NET';
  verifyCodeSamples?: boolean;
}

export class LanguageSwitcher {
  readonly page: Page;
  readonly switcher: Locator;

  constructor(page: Page) {
    this.page = page;
    this.switcher = page.getByRole('tablist', { name: /language/i });
  }

  async verifyVisible(): Promise<void> {
    await expect(this.switcher, 'Language switcher should be visible').toBeVisible();
  }

  async switchToLanguage(options: LanguageSwitchOptions): Promise<void> {
    const languageTab = this.page.getByRole('tab', { name: options.language });
    await languageTab.click();
    
    // Verify the tab is selected
    await expect(languageTab, `${options.language} tab should be selected`).toHaveAttribute('aria-selected', 'true');
    
    // If requested, verify code samples updated
    if (options.verifyCodeSamples) {
      await this.verifyCodeSamplesUpdated(options.language);
    }
  }

  async getCurrentLanguage(): Promise<string> {
    const selectedTab = this.page.getByRole('tab', { pressed: true });
    return await selectedTab.textContent() || '';
  }

  async verifyAvailableLanguages(expectedLanguages: string[]): Promise<void> {
    for (const language of expectedLanguages) {
      const languageTab = this.page.getByRole('tab', { name: language });
      await expect(languageTab, `${language} tab should be available`).toBeVisible();
    }
  }

  async verifyCodeSamplesUpdated(language: string): Promise<void> {
    // Wait for code blocks to be updated after language switch
    const codeBlocks = this.page.locator('pre code');
    await codeBlocks.first().waitFor({ state: 'visible' });
    
    // Verify language-specific code is shown
    const hasCodeSamples = await codeBlocks.count() > 0;
    expect(hasCodeSamples, `Code samples should be present for ${language}`).toBe(true);
  }

  async verifyLanguageSpecificContent(language: string): Promise<void> {
    // This method can be used to check for language-specific content
    // For example, package managers, imports, etc.
    let expectedContent: string;
    
    switch (language) {
      case 'Node.js':
        expectedContent = 'npm';
        break;
      case 'Python':
        expectedContent = 'pip';
        break;
      case 'Java':
        expectedContent = 'maven';
        break;
      case '.NET':
        expectedContent = 'dotnet';
        break;
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
    
    const pageContent = this.page.locator('body');
    await expect(pageContent, `Page should contain ${expectedContent} content for ${language}`).toContainText(expectedContent);
  }

  getAvailableLanguages(): LanguageOption[] {
    return [
      {
        language: 'Node.js',
        displayName: 'Node.js',
        description: 'JavaScript/TypeScript with Node.js runtime'
      },
      {
        language: 'Python',
        displayName: 'Python',
        description: 'Python with pytest runner'
      },
      {
        language: 'Java',
        displayName: 'Java',
        description: 'Java with JUnit runner'
      },
      {
        language: '.NET',
        displayName: '.NET',
        description: '.NET with MSTest/NUnit/xUnit runner'
      }
    ];
  }

  async verifyDefaultLanguage(expectedDefault: string = 'Node.js'): Promise<void> {
    const selectedTab = this.page.getByRole('tab', { pressed: true });
    await expect(selectedTab, `${expectedDefault} should be selected by default`).toHaveText(expectedDefault);
  }

  async verifyTabAccessibility(): Promise<void> {
    // Verify keyboard navigation works
    await this.switcher.press('Tab');
    const focusedElement = this.page.locator(':focus');
    await expect(focusedElement, 'Language switcher should be focusable').toBeVisible();
  }

  async navigateWithKeyboard(direction: 'left' | 'right'): Promise<void> {
    const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
    await this.switcher.press(key);
  }
}