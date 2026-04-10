// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/search.fixture';

test.describe('Search Results Functionality', () => {
  test('should return categorized search results for common terms', async ({ searchFromHomepage }) => {
    await test.step('Search for "locator"', async () => {
      await searchFromHomepage.search.performSearch({
        query: 'locator',
        verifyResults: true
      });
    });

    await test.step('Verify results are categorized and visible', async () => {
      await searchFromHomepage.search.verifyResults({
        categoriesVisible: true,
        hasResults: true
      });
    });

    await test.step('Verify search term is highlighted in results', async () => {
      await searchFromHomepage.search.verifySearchTermHighlighted();
    });
  });

  test('should navigate to correct page when result is clicked', async ({ searchFromHomepage }) => {
    await test.step('Search for "locator"', async () => {
      await searchFromHomepage.search.performSearch({ query: 'locator' });
    });

    await test.step('Click on Locators result and verify navigation', async () => {
      await searchFromHomepage.search.selectResult('Locators');
      await expect(searchFromHomepage.page, 'Should navigate to Locators page').toHaveURL('/docs/locators');
      await searchFromHomepage.search.verifyModalClosed();
    });
  });

  test('should handle different search terms correctly', async ({ searchFromHomepage }) => {
    const searchQueries = ['page', 'test', 'browser'];

    for (const query of searchQueries) {
      await test.step(`Search for "${query}" and verify categorized results`, async () => {
        await searchFromHomepage.search.open();
        await searchFromHomepage.search.performSearch({
          query,
          verifyResults: true
        });
        await searchFromHomepage.search.verifyResults({
          categoriesVisible: true,
          hasResults: true
        });
        await searchFromHomepage.search.close();
      });
    }
  });

  test('should clear search and return to initial state', async ({ searchFromHomepage }) => {
    await test.step('Perform a search for "locator"', async () => {
      await searchFromHomepage.search.performSearch({ query: 'locator' });
    });

    await test.step('Clear search and verify return to initial state', async () => {
      await searchFromHomepage.search.clearSearch();
      await searchFromHomepage.search.verifyInitialState();
    });
  });

  test('should handle non-existent search terms gracefully', async ({ searchFromHomepage }) => {
    await test.step('Search for a non-existent term', async () => {
      await searchFromHomepage.search.performSearch({
        query: 'nonexistentterm123',
        verifyResults: false
      });
    });

    await test.step('Verify search input remains functional', async () => {
      await searchFromHomepage.search.verifyInputFocused();
    });

    await test.step('Close modal', async () => {
      await searchFromHomepage.search.close();
    });
  });

  test('should work consistently from docs page', async ({ searchFromDocs }) => {
    await test.step('Search for "configuration" from docs page', async () => {
      await searchFromDocs.search.performSearch({
        query: 'configuration',
        verifyResults: true
      });
    });

    await test.step('Verify results are shown correctly', async () => {
      await searchFromDocs.search.verifyResults({
        categoriesVisible: true,
        hasResults: true
      });
    });

    await test.step('Close modal', async () => {
      await searchFromDocs.search.close();
    });
  });
});