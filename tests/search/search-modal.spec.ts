// spec: specs/playwright-docs-comprehensive-test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../fixtures/search.fixture';

test.describe('Search Modal Functionality', () => {
  test('should open and close search modal correctly', async ({ searchFromHomepage }) => {
    await test.step('Open search modal', async () => {
      await searchFromHomepage.search.open();
    });

    await test.step('Verify modal is open with initial state', async () => {
      await searchFromHomepage.search.verifyModalOpen();
      await searchFromHomepage.search.verifyInitialState();
    });

    await test.step('Close modal and verify it is closed', async () => {
      await searchFromHomepage.search.close();
      await searchFromHomepage.search.verifyModalClosed();
    });
  });

  test('should open search modal with keyboard shortcut', async ({ searchFromHomepage }) => {
    await test.step('Open modal with keyboard shortcut (Cmd+K / Ctrl+K)', async () => {
      await searchFromHomepage.search.openWithKeyboard();
    });

    await test.step('Verify modal is open and input is focused', async () => {
      await searchFromHomepage.search.verifyModalOpen();
      await searchFromHomepage.search.verifyInputFocused();
    });

    await test.step('Close modal', async () => {
      await searchFromHomepage.search.close();
    });
  });

  test('should display keyboard shortcuts and instructions', async ({ searchFromHomepage }) => {
    await test.step('Open search modal', async () => {
      await searchFromHomepage.search.open();
    });

    await test.step('Verify keyboard shortcuts are displayed', async () => {
      await searchFromHomepage.search.verifyKeyboardShortcuts();
    });

    await test.step('Close modal', async () => {
      await searchFromHomepage.search.close();
    });
  });

  test('should handle modal behavior from docs page', async ({ searchFromDocs }) => {
    await test.step('Open search modal from docs page', async () => {
      await searchFromDocs.search.open();
    });

    await test.step('Verify modal behavior is consistent on docs page', async () => {
      await searchFromDocs.search.verifyModalOpen();
      await searchFromDocs.search.verifyInitialState();
    });

    await test.step('Close modal', async () => {
      await searchFromDocs.search.close();
    });
  });
});