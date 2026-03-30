// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/search.fixture';

test.describe('Search Results Functionality', () => {
  test('should return categorized search results for common terms', async ({ searchFromHomepage }) => {
    // Search for 'locator' using component method with DTO pattern
    await searchFromHomepage.search.performSearch({
      query: 'locator',
      verifyResults: true
    });
    
    // Verify results are categorized using component method
    await searchFromHomepage.search.verifyResults({
      categoriesVisible: true,
      hasResults: true
    });
    
    // Verify search term highlighting
    await searchFromHomepage.search.verifySearchTermHighlighted();
  });

  test('should navigate to correct page when result is clicked', async ({ searchFromHomepage }) => {
    await searchFromHomepage.search.performSearch({ query: 'locator' });
    
    // Click on a search result using component method
    await searchFromHomepage.search.selectResult('Locators');
    
    // Verify navigation occurred and modal closed
    await expect(searchFromHomepage.page, 'Should navigate to Locators page').toHaveURL('/docs/locators');
    await searchFromHomepage.search.verifyModalClosed();
  });

  test('should handle different search terms correctly', async ({ searchFromHomepage }) => {
    const searchQueries = ['page', 'test', 'browser'];
    
    for (const query of searchQueries) {
      // Open search for each query
      await searchFromHomepage.search.open();
      
      // Search using DTO pattern
      await searchFromHomepage.search.performSearch({
        query,
        verifyResults: true
      });
      
      // Verify results structure
      await searchFromHomepage.search.verifyResults({
        categoriesVisible: true,
        hasResults: true
      });
      
      // Close search for next iteration
      await searchFromHomepage.search.close();
    }
  });

  test('should clear search and return to initial state', async ({ searchFromHomepage }) => {
    // Perform a search
    await searchFromHomepage.search.performSearch({ query: 'locator' });
    
    // Clear search using component method
    await searchFromHomepage.search.clearSearch();
    
    // Verify return to initial state
    await searchFromHomepage.search.verifyInitialState();
  });

  test('should handle non-existent search terms gracefully', async ({ searchFromHomepage }) => {
    await searchFromHomepage.search.performSearch({
      query: 'nonexistentterm123',
      verifyResults: false
    });
    
    // Verify search interface remains functional
    await searchFromHomepage.search.verifyInputFocused();
    
    await searchFromHomepage.search.close();
  });

  test('should work consistently from docs page', async ({ searchFromDocs }) => {
    // Test search functionality from docs context
    await searchFromDocs.search.performSearch({
      query: 'configuration',
      verifyResults: true
    });
    
    await searchFromDocs.search.verifyResults({
      categoriesVisible: true,
      hasResults: true
    });
    
    await searchFromDocs.search.close();
  });
});