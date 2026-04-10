import { Page, Locator, expect } from '@playwright/test';

export interface SearchOptions {
  query: string;
  selectFirst?: boolean;
}

export interface SearchVerifications {
  hasResults?: boolean;
  categoriesVisible?: boolean;
  keyboardShortcuts?: boolean;
}

export class SearchModal {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly clearButton: Locator;
  readonly resultsContainer: Locator;
  readonly guidesSection: Locator;
  readonly classesSection: Locator;
  readonly noRecentSearches: Locator;
  readonly keyboardShortcuts: Locator;
  readonly modalDialog: Locator;

  constructor(page: Page) {
    this.page = page;
    // The search UI renders as an expanded button wrapping the modal content (no dialog role)
    this.modalDialog = page.locator('button[aria-expanded="true"]').filter({ has: page.getByRole('searchbox') });
    this.searchBox = page.getByRole('searchbox', { name: 'Search' });
    this.clearButton = page.getByRole('button', { name: 'Clear the query' });
    // Results appear as multiple listbox[name="Search"] elements, one per category
    this.resultsContainer = page.getByRole('listbox', { name: 'Search' }).first();
    // Category headings are plain divs inside the search container
    this.guidesSection = page.locator('button[aria-expanded="true"]').locator('text=Guides').first();
    this.classesSection = page.locator('button[aria-expanded="true"]').locator('text=Classes').first();
    // After clearing, the initial state shows an empty focused input (no "No recent searches" text)
    this.noRecentSearches = page.locator('button[aria-expanded="true"]').locator('[role="listbox"]');
    this.keyboardShortcuts = page.locator('footer').locator('list');
  }

  async open(): Promise<void> {
    const searchButton = this.page.getByRole('button', { name: /search/i });
    await searchButton.click();
    await this.searchBox.waitFor({ state: 'visible' });
  }

  async openWithKeyboard(): Promise<void> {
    await this.page.keyboard.press('Meta+k');
    await this.searchBox.waitFor({ state: 'visible' });
  }

  async performSearch(options: SearchOptions & { verifyResults?: boolean }): Promise<void> {
    if (!await this.isOpen()) {
      await this.open();
    }

    await this.searchBox.fill(options.query);

    if (options.verifyResults) {
      await expect(this.resultsContainer, 'Search results should appear').toBeVisible();
    }

    if (options.selectFirst) {
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
    }
  }

  async isOpen(): Promise<boolean> {
    try {
      await this.searchBox.waitFor({ state: 'visible', timeout: 1000 });
      return true;
    } catch {
      return false;
    }
  }

  async search(options: SearchOptions): Promise<void> {
    if (!await this.isOpen()) {
      throw new Error('Search modal is not open');
    }
    
    await this.searchBox.fill(options.query);
    
    if (options.selectFirst) {
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('Enter');
    }
  }

  async clear(): Promise<void> {
    await this.clearButton.click();
  }

  async close(): Promise<void> {
    await this.page.keyboard.press('Escape');
  }

  async selectResult(text: string): Promise<void> {
    await this.page.getByRole('option', { name: new RegExp(text) }).first().click();
  }

  async verifyInitialState(): Promise<void> {
    await expect(this.searchBox, 'Search input should be visible').toBeVisible();
    await expect(this.searchBox, 'Search input should be focused').toBeFocused();
    await expect(this.searchBox, 'Search input should be empty after clear').toHaveValue('');
  }

  async verifyKeyboardShortcuts(): Promise<void> {
    await expect(this.page.getByText('to close'), 'Escape shortcut should be shown').toBeVisible();
    await expect(this.page.getByText('to select'), 'Enter shortcut should be shown').toBeVisible();
    await expect(this.page.getByText('to navigate'), 'Arrow shortcuts should be shown').toBeVisible();
  }

  async verifyResults(options: SearchVerifications): Promise<void> {
    if (options.categoriesVisible) {
      // Each category renders as a separate listbox; verify at least one is visible
      await expect(this.page.getByRole('listbox', { name: 'Search' }).first(),
        'At least one result category should be visible').toBeVisible();
    }

    if (options.hasResults) {
      await expect(this.page.getByRole('option').first(), 'Search results should be present').toBeVisible();
    }
  }

  async verifySearchTermHighlighted(): Promise<void> {
    await expect(this.page.locator('mark').first(), 'Search terms should be highlighted').toBeVisible();
  }

  async verifyModalOpen(): Promise<void> {
    await expect(this.searchBox, 'Search modal should be open').toBeVisible();
  }

  async verifyModalClosed(): Promise<void> {
    await expect(this.searchBox, 'Search modal should be closed').not.toBeVisible();
  }

  async verifyInputFocused(): Promise<void> {
    await expect(this.searchBox, 'Search input should be focused').toBeFocused();
  }

  async clearSearch(): Promise<void> {
    // Look for clear button and click it, or clear the input field
    const clearButton = this.page.getByRole('button', { name: /clear.*query/i });
    
    if (await clearButton.isVisible()) {
      await clearButton.click();
    } else {
      // Alternative: clear the input field directly
      await this.searchBox.clear();
    }
  }
}