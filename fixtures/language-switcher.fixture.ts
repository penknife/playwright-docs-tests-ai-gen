import { test as base } from '@playwright/test';
import { DocsPage } from '../pages/docs.page';

export const test = base.extend<{ languagePage: DocsPage }>({
  languagePage: async ({ page }, use) => {
    const docsPage = new DocsPage(page);
    // Navigate to a docs page that has language switcher (Getting Started with Installation)
    await docsPage.goto('intro');
    await use(docsPage);
  },
});

export { expect } from '@playwright/test';