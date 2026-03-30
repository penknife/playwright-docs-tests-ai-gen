import { Page, Locator, expect } from '@playwright/test';

export interface VersionOption {
  version: string;
  displayName: string;
  isStable?: boolean;
  isDeprecated?: boolean;
}

export interface VersionSwitchOptions {
  version: string;
  verifyURLUpdate?: boolean;
}

export class VersionSwitcher {
  readonly page: Page;
  readonly versionDropdown: Locator;
  readonly versionButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.versionButton = page.getByRole('button', { name: /version/i });
    this.versionDropdown = page.getByRole('menu', { name: /version/i });
  }

  async verifyVisible(): Promise<void> {
    await expect(this.versionButton, 'Version switcher button should be visible').toBeVisible();
  }

  async openVersionMenu(): Promise<void> {
    await this.versionButton.click();
    await expect(this.versionDropdown, 'Version dropdown should be visible').toBeVisible();
  }

  async closeVersionMenu(): Promise<void> {
    // Click outside the dropdown or press Escape
    await this.page.press('body', 'Escape');
    await expect(this.versionDropdown, 'Version dropdown should be hidden').not.toBeVisible();
  }

  async switchToVersion(options: VersionSwitchOptions): Promise<void> {
    await this.openVersionMenu();
    
    const versionOption = this.page.getByRole('menuitem', { name: options.version });
    await versionOption.click();
    
    if (options.verifyURLUpdate) {
      // Verify URL contains the version
      await expect(this.page, `URL should contain version ${options.version}`).toHaveURL(
        new RegExp(`\\/v${options.version.replace('.', '\\.')}`)
      );
    }
    
    // Verify the button shows the new version
    await expect(this.versionButton, `Version button should show ${options.version}`).toContainText(options.version);
  }

  async getCurrentVersion(): Promise<string> {
    const buttonText = await this.versionButton.textContent();
    return buttonText?.trim() || '';
  }

  async verifyAvailableVersions(expectedVersions: string[]): Promise<void> {
    await this.openVersionMenu();
    
    for (const version of expectedVersions) {
      const versionOption = this.page.getByRole('menuitem', { name: version });
      await expect(versionOption, `Version ${version} should be available`).toBeVisible();
    }
    
    await this.closeVersionMenu();
  }

  async verifyVersionMetadata(version: VersionOption): Promise<void> {
    await this.openVersionMenu();
    
    const versionOption = this.page.getByRole('menuitem', { name: version.displayName });
    await expect(versionOption, `Version ${version.displayName} should be available`).toBeVisible();
    
    if (version.isDeprecated) {
      await expect(versionOption, `Version ${version.displayName} should show deprecated warning`).toContainText('deprecated');
    }
    
    if (version.isStable) {
      await expect(versionOption, `Version ${version.displayName} should show stable indicator`).toContainText('stable');
    }
    
    await this.closeVersionMenu();
  }

  async verifyVersionPersistence(): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    
    // Navigate to different page and back
    await this.page.goBack();
    await this.page.goForward();
    
    // Verify version is still selected
    const persistedVersion = await this.getCurrentVersion();
    expect(persistedVersion, 'Version selection should persist across navigation').toBe(currentVersion);
  }

  getCommonVersions(): VersionOption[] {
    return [
      {
        version: '1.44',
        displayName: 'v1.44 (latest)',
        isStable: true
      },
      {
        version: '1.43',
        displayName: 'v1.43',
        isStable: true
      },
      {
        version: '1.42',
        displayName: 'v1.42',
        isStable: true
      },
      {
        version: '1.40',
        displayName: 'v1.40',
        isDeprecated: true
      }
    ];
  }

  async verifyDefaultVersion(): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    expect(currentVersion, 'Should have a default version selected').toBeTruthy();
  }

  async verifyKeyboardNavigation(): Promise<void> {
    // Tab to version switcher
    await this.versionButton.focus();
    await expect(this.versionButton, 'Version switcher should be focusable').toBeFocused();
    
    // Open with Enter
    await this.versionButton.press('Enter');
    await expect(this.versionDropdown, 'Version dropdown should open with Enter').toBeVisible();
    
    // Navigate with arrow keys
    await this.page.press('body', 'ArrowDown');
    
    // Close with Escape
    await this.page.press('body', 'Escape');
    await expect(this.versionDropdown, 'Version dropdown should close with Escape').not.toBeVisible();
  }
}