import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { DocsPage } from '../pages/docs.page';

export interface SearchFixtures {
  searchFromHomepage: HomePage;
  searchFromDocs: DocsPage;
}

export const test = base.extend<SearchFixtures>({
  searchFromHomepage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.goto();
    await use(homePage);
  },

  searchFromDocs: async ({ page }, use) => {
    const docsPage = new DocsPage(page);
    await docsPage.goto();
    await use(docsPage);
  },
});

export { expect } from '@playwright/test';