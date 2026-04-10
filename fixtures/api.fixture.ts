import { test as base } from '@playwright/test';
import { ApiPage } from '../pages/api.page';

export const test = base.extend<{ apiPage: ApiPage }>({
  apiPage: async ({ page }, use) => {
    const apiPage = new ApiPage(page);
    await apiPage.goto(); // Defaults to main Playwright class page
    await use(apiPage);
  },
});

export { expect } from '@playwright/test';