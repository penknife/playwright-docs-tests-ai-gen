import { Page, Locator, expect } from '@playwright/test';

export interface NavigationSection {
  name: string;
  subsections?: string[];
}

export interface NavigationOptions {
  section: string;
  subsection?: string;
}

export class LeftNavigationPanel {
  readonly page: Page;
  readonly sidebar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.getByRole('navigation', { name: 'Docs sidebar' });
  }

  async verifyVisible(): Promise<void> {
    await expect(this.sidebar, 'Left navigation panel should be visible').toBeVisible();
  }

  async expandSection(sectionName: string): Promise<void> {
    const sectionButton = this.page.getByRole('button', { name: sectionName });
    const isExpanded = await sectionButton.getAttribute('aria-expanded') === 'true';
    
    if (!isExpanded) {
      await sectionButton.click();
    }
  }

  async collapseSection(sectionName: string): Promise<void> {
    const sectionButton = this.page.getByRole('button', { name: sectionName });
    const isExpanded = await sectionButton.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      await sectionButton.click();
    }
  }

  async navigateTo(options: NavigationOptions): Promise<void> {
    // First ensure the section is expanded
    await this.expandSection(options.section);
    
    if (options.subsection) {
      await this.page.getByRole('link', { name: options.subsection, exact: true }).click();
    } else {
      await this.page.getByRole('link', { name: options.section }).click();
    }
  }

  async verifySection(section: NavigationSection): Promise<void> {
    const sectionButton = this.page.getByRole('button', { name: section.name });
    await expect(sectionButton, `${section.name} section should be visible`).toBeVisible();

    if (section.subsections) {
      // Expand section to check subsections
      await this.expandSection(section.name);
      
      for (const subsection of section.subsections) {
        const subsectionLink = this.page.getByRole('link', { name: subsection });
        await expect(subsectionLink, `${subsection} subsection should be visible`).toBeVisible();
      }
    }
  }

  async verifySectionState(sectionName: string, expanded: boolean): Promise<void> {
    const sectionButton = this.page.getByRole('button', { name: sectionName });
    const isExpanded = await sectionButton.getAttribute('aria-expanded') === 'true';
    
    if (expanded) {
      expect(isExpanded, `${sectionName} section should be expanded`).toBe(true);
    } else {
      expect(isExpanded, `${sectionName} section should be collapsed`).toBe(false);
    }
  }

  async verifyCurrentHighlight(linkName: string): Promise<void> {
    // This would check for active/current state styling if available
    const currentLink = this.page.getByRole('link', { name: linkName });
    await expect(currentLink, `${linkName} should be highlighted as current page`).toBeVisible();
  }

  async toggleSectionState(sectionName: string): Promise<void> {
    const sectionButton = this.page.getByRole('button', { name: sectionName });
    await sectionButton.click();
  }

  getGettingStartedSection(): NavigationSection {
    return {
      name: 'Getting Started',
      subsections: [
        'Installation',
        'Writing tests', 
        'Generating tests',
        'Running and debugging tests',
        'Trace viewer',
        'Setting up CI'
      ]
    };
  }

  getPlaywrightTestSection(): NavigationSection {
    return {
      name: 'Playwright Test',
      subsections: [
        'Configuration',
        'Fixtures',
        'Reporters',
        'Parallelism',
        'Retries'
      ]
    };
  }

  getGuidesSection(): NavigationSection {
    return {
      name: 'Guides',
      subsections: [
        'Locators',
        'Actions',
        'Assertions',
        'Authentication',
        'Best Practices'
      ]
    };
  }
}