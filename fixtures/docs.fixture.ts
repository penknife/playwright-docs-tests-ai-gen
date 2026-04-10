import { test as base } from '@playwright/test';
import { DocsPage } from '../pages/docs.page';

export const test = base.extend<{ docsPage: DocsPage }>({
  docsPage: async ({ page }, use) => {
    const docsPage = new DocsPage(page);
    await docsPage.goto();
    await use(docsPage);
  },
});

export { expect } from '@playwright/test';