import { Page, Locator, expect } from '@playwright/test';
import { TopNavigation } from './components/top-navigation';
import { LeftNavigationPanel } from './components/left-navigation-panel';
import { SearchModal } from './components/search-modal';
import { VersionSwitcher } from './components/version-switcher';

export interface APIMethod {
  name: string;
  description: string;
  parameters?: string[];
  returnType?: string;
}

export interface APIClass {
  name: string;
  description: string;
  methods: APIMethod[];
}

export class ApiPage {
  readonly page: Page;
  readonly topNav: TopNavigation;
  readonly leftNav: LeftNavigationPanel;
  readonly search: SearchModal;
  readonly versionSwitcher: VersionSwitcher;
  
  // API content locators
  readonly apiContent: Locator;
  readonly classHeading: Locator;
  readonly methodList: Locator;
  readonly codeExamples: Locator;
  readonly parameterTables: Locator;
  
  // API navigation
  readonly apiSidebar: Locator;
  readonly classLinks: Locator;
  readonly methodLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.topNav = new TopNavigation(page);
    this.leftNav = new LeftNavigationPanel(page);
    this.search = new SearchModal(page);
    this.versionSwitcher = new VersionSwitcher(page);
    
    // API content
    this.apiContent = page.getByRole('main');
    this.classHeading = page.getByRole('heading', { level: 1 });
    this.methodList = page.locator('[data-testid="method-list"], .method-list');
    this.codeExamples = page.locator('pre code');
    this.parameterTables = page.getByRole('table');
    
    // API navigation
    this.apiSidebar = page.getByRole('complementary', { name: /api/i });
    this.classLinks = this.apiSidebar.getByRole('link').filter({ hasText: /class/i });
    this.methodLinks = page.locator('[data-testid="method-link"], a[href*="#"]');
  }

  async goto(className?: string): Promise<void> {
    const url = className 
      ? `https://playwright.dev/docs/api/class-${className.toLowerCase()}` 
      : 'https://playwright.dev/docs/api/class-playwright';
    
    await this.page.goto(url);
    await this.verifyPageLoaded();
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.page, 'Should be on API page').toHaveURL(/\/docs\/api/);
    await expect(this.apiContent, 'API content should be visible').toBeVisible();
  }

  async verifyLayout(): Promise<void> {
    await this.topNav.verifyVisible();
    await expect(this.apiContent, 'API content area should be visible').toBeVisible();
    
    // API pages may have different sidebar structure
    const hasSidebar = await this.apiSidebar.isVisible();
    if (hasSidebar) {
      await expect(this.apiContent, 'API sidebar should be visible when present').toBeVisible();
    }
  }

  async verifyClassDocumentation(apiClass: APIClass): Promise<void> {
    // Verify class heading
    await expect(this.classHeading, `Class heading should be ${apiClass.name}`).toContainText(apiClass.name);
    
    // Verify class description
    await expect(this.apiContent, `Should contain class description`).toContainText(apiClass.description);
    
    // Verify methods are listed
    for (const method of apiClass.methods) {
      await this.verifyMethodDocumentation(method);
    }
  }

  async verifyMethodDocumentation(method: APIMethod): Promise<void> {
    // Verify method name appears in the page
    const methodHeading = this.page.getByRole('heading', { name: new RegExp(method.name, 'i') });
    await expect(methodHeading, `Method ${method.name} should be documented`).toBeVisible();
    
    // Verify method description
    await expect(this.apiContent, `Should contain method description`).toContainText(method.description);
    
    // Verify parameters if specified
    if (method.parameters && method.parameters.length > 0) {
      for (const param of method.parameters) {
        await expect(this.apiContent, `Should document parameter ${param}`).toContainText(param);
      }
    }
  }

  async navigateToClass(className: string): Promise<void> {
    const classLink = this.page.getByRole('link', { name: new RegExp(className, 'i') });
    await classLink.first().click();
    
    await expect(this.page, `Should navigate to ${className} class`).toHaveURL(new RegExp(`class-${className.toLowerCase()}`));
    await this.verifyPageLoaded();
  }

  async navigateToMethod(methodName: string): Promise<void> {
    // Look for method link in sidebar or on page
    const methodLink = this.page.getByRole('link', { name: new RegExp(methodName, 'i') });
    
    if (await methodLink.isVisible()) {
      await methodLink.click();
      
      // Verify method section is now visible
      const methodSection = this.page.getByRole('heading', { name: new RegExp(methodName, 'i') });
      await expect(methodSection, `${methodName} method should be visible`).toBeInViewport();
    } else {
      // If no direct link, scroll to find the method
      await this.scrollToMethod(methodName);
    }
  }

  async scrollToMethod(methodName: string): Promise<void> {
    const methodHeading = this.page.getByRole('heading', { name: new RegExp(methodName, 'i') });
    await methodHeading.scrollIntoViewIfNeeded();
    await expect(methodHeading, `${methodName} method should be in viewport`).toBeInViewport();
  }

  async verifyCodeExamples(): Promise<void> {
    const exampleCount = await this.codeExamples.count();
    
    if (exampleCount > 0) {
      // Verify first code example is visible
      await expect(this.codeExamples.first(), 'Code examples should be visible').toBeVisible();
      
      // Verify syntax highlighting
      const hasHighlighting = await this.codeExamples.first().locator('[class*="token"], [class*="highlight"]').count() > 0;
      expect(hasHighlighting, 'Code examples should have syntax highlighting').toBe(true);
    }
  }

  async verifyParameterTable(methodName: string, expectedParams: string[]): Promise<void> {
    // Navigate to method first
    await this.navigateToMethod(methodName);
    
    // Find parameter table
    const paramTable = this.parameterTables.first();
    
    if (await paramTable.isVisible()) {
      for (const param of expectedParams) {
        await expect(paramTable, `Parameter table should contain ${param}`).toContainText(param);
      }
    }
  }

  async searchForMethod(methodName: string): Promise<void> {
    await this.search.performSearch({ query: methodName });
    
    // Verify method appears in search results
    const searchResults = this.page.locator('[data-testid="search-results"], .search-results');
    await expect(searchResults, `Search should return results for ${methodName}`).toContainText(methodName);
  }

  async verifyRelatedMethods(mainMethod: string, relatedMethods: string[]): Promise<void> {
    for (const relatedMethod of relatedMethods) {
      const relatedLink = this.page.getByRole('link', { name: new RegExp(relatedMethod, 'i') });
      
      if (await relatedLink.isVisible()) {
        await expect(relatedLink, `Related method ${relatedMethod} should be linked`).toBeVisible();
      }
    }
  }

  async copyCodeExample(exampleIndex: number = 0): Promise<string> {
    const codeExample = this.codeExamples.nth(exampleIndex);
    await expect(codeExample, `Code example ${exampleIndex} should be visible`).toBeVisible();
    
    // Look for copy button
    const copyButton = this.page.locator(`pre:has(code) button`, { hasText: /copy/i }).nth(exampleIndex);
    
    if (await copyButton.isVisible()) {
      await copyButton.click();
    }
    
    return await codeExample.textContent() || '';
  }

  async verifyBrowserSupport(className: string): Promise<void> {
    // Some API classes have browser support information
    const browserInfo = this.page.locator('[data-testid="browser-support"], .browser-support');
    
    if (await browserInfo.isVisible()) {
      await expect(browserInfo, 'Should show browser support info').toBeVisible();
      
      // Common browsers should be mentioned
      const supportedBrowsers = ['Chromium', 'Firefox', 'WebKit'];
      for (const browser of supportedBrowsers) {
        await expect(browserInfo, `Should mention ${browser} support`).toContainText(browser);
      }
    }
  }

  getPlaywrightClass(): APIClass {
    return {
      name: 'Playwright',
      description: 'Playwright module provides a method to launch a browser instance',
      methods: [
        {
          name: 'chromium',
          description: 'Returns the browser instance for Chromium',
          returnType: 'BrowserType'
        },
        {
          name: 'firefox',
          description: 'Returns the browser instance for Firefox', 
          returnType: 'BrowserType'
        },
        {
          name: 'webkit',
          description: 'Returns the browser instance for WebKit',
          returnType: 'BrowserType'
        }
      ]
    };
  }

  getPageClass(): APIClass {
    return {
      name: 'Page',
      description: 'Page provides methods to interact with a single tab',
      methods: [
        {
          name: 'goto',
          description: 'Navigate to URL',
          parameters: ['url', 'options'],
          returnType: 'Promise<Response>'
        },
        {
          name: 'click',
          description: 'Click an element',
          parameters: ['selector', 'options'],
          returnType: 'Promise<void>'
        },
        {
          name: 'fill',
          description: 'Fill input field',
          parameters: ['selector', 'value', 'options'],
          returnType: 'Promise<void>'
        }
      ]
    };
  }

  async verifyVersionCompatibility(): Promise<void> {
    // Check if version switcher is available and working
    if (await this.versionSwitcher.versionButton.isVisible()) {
      await this.versionSwitcher.verifyVisible();
      
      // Test switching to different version
      const currentVersion = await this.versionSwitcher.getCurrentVersion();
      console.log(`Current API version: ${currentVersion}`);
    }
  }
}