// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/search.fixture';

test.describe('Search Modal Functionality', () => {
  test('should open and close search modal correctly', async ({ searchFromHomepage }) => {
    // Open search modal using component method
    await searchFromHomepage.search.open();
    
    // Verify modal state using component verification
    await searchFromHomepage.search.verifyModalOpen();
    
    // Verify initial state shows no recent searches
    await searchFromHomepage.search.verifyInitialState();
    
    // Close modal using Escape and verify it closes
    await searchFromHomepage.search.close();
    await searchFromHomepage.search.verifyModalClosed();
  });

  test('should open search modal with keyboard shortcut', async ({ searchFromHomepage }) => {
    // Open using keyboard shortcut (Cmd+K/Ctrl+K)
    await searchFromHomepage.search.openWithKeyboard();
    
    // Verify modal opens and input is focused
    await searchFromHomepage.search.verifyModalOpen();
    await searchFromHomepage.search.verifyInputFocused();
    
    // Close modal
    await searchFromHomepage.search.close();
  });

  test('should display keyboard shortcuts and instructions', async ({ searchFromHomepage }) => {
    await searchFromHomepage.search.open();
    
    // Verify keyboard shortcuts are displayed using component method
    await searchFromHomepage.search.verifyKeyboardShortcuts();
    
    await searchFromHomepage.search.close();
  });

  test('should handle modal behavior from docs page', async ({ searchFromDocs }) => {
    // Test search modal from docs page context
    await searchFromDocs.search.open();
    await searchFromDocs.search.verifyModalOpen();
    
    // Verify consistent behavior across different page contexts
    await searchFromDocs.search.verifyInitialState();
    
    await searchFromDocs.search.close();
  });
});