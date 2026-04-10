# Playwright Documentation Website Test Plan

## Application Overview

Comprehensive test plan for https://playwright.dev, a documentation website for the Playwright testing framework. The site provides documentation, API references, and community resources across multiple programming languages (Node.js, Python, Java, .NET). Key features include language-specific documentation, search functionality, comprehensive navigation, and community resources.

## Test Scenarios

### 1. Homepage Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Homepage Layout and Content

**File:** `tests/homepage/homepage-layout.spec.ts`

**Steps:**
  1. Navigate to the homepage
    - expect: Page loads successfully
    - expect: Page title contains 'Fast and reliable end-to-end testing for modern web apps | Playwright'
    - expect: Main heading 'Playwright enables reliable end-to-end testing for modern web apps.' is visible
    - expect: Navigation bar with Docs, API, Language switcher, and Community links is present
  2. Verify hero section content
    - expect: Get started button is visible and clickable
    - expect: Star count displayed for GitHub repository
    - expect: Feature sections (Any browser/platform/One API, Resilient/No flaky tests, etc.) are visible
  3. Verify company logos section
    - expect: Companies section shows logos of VS Code, Bing, Outlook, Disney+ Hotstar, Material UI, ING
    - expect: All company logos are properly displayed with alt text

#### 1.2. Homepage Navigation Links

**File:** `tests/homepage/homepage-navigation.spec.ts`

**Steps:**
  1. Click on 'Get started' button
    - expect: User is redirected to the installation documentation page (/docs/intro)
    - expect: Page loads successfully with proper content
  2. Navigate back to homepage and click GitHub star button
    - expect: New tab/window opens with GitHub repository page
    - expect: GitHub URL contains 'microsoft/playwright'
  3. Test all language-specific links in feature section
    - expect: TypeScript link leads to Node.js docs intro
    - expect: JavaScript link leads to Node.js docs intro
    - expect: Python link leads to Python docs intro
    - expect: .NET link leads to .NET docs intro
    - expect: Java link leads to Java docs intro

### 2. Documentation Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1. Docs Sidebar Navigation

**File:** `tests/docs/docs-sidebar-navigation.spec.ts`

**Steps:**
  1. Navigate to docs section and verify sidebar structure
    - expect: Left sidebar contains Getting Started section (expanded)
    - expect: Getting Started includes: Installation, Writing tests, Generating tests, Running and debugging tests, Trace viewer, Setting up CI
    - expect: Playwright Test section is present and can be expanded
    - expect: Guides section is present and can be expanded
  2. Expand and collapse sidebar sections
    - expect: Clicking section headers toggles expansion/collapse
    - expect: Expanded sections show their subsections
    - expect: Collapsed sections hide their subsections
    - expect: Visual indicators (arrows) correctly reflect section state
  3. Navigate through Getting Started flow
    - expect: Installation page loads with installation instructions
    - expect: Writing tests page shows test writing guidance
    - expect: Generating tests page explains codegen functionality
    - expect: Each page maintains proper sidebar highlighting for current section

#### 2.2. Docs Content and Breadcrumbs

**File:** `tests/docs/docs-content-navigation.spec.ts`

**Steps:**
  1. Verify breadcrumb navigation in docs section
    - expect: Breadcrumbs show current page hierarchy
    - expect: Breadcrumbs are clickable and functional
    - expect: Home breadcrumb returns to main site
  2. Navigate between different documentation sections
    - expect: URL updates correctly for each section
    - expect: Page content changes appropriately
    - expect: Sidebar highlighting follows current page
    - expect: Page titles update in browser tab
  3. Test deep navigation in Playwright Test section
    - expect: Configuration page loads with config options
    - expect: Fixtures page explains test fixtures
    - expect: All subsection pages load properly
    - expect: Navigation remains consistent across all pages

### 3. Search Functionality

**Seed:** `tests/seed.spec.ts`

#### 3.1. Search Modal Behavior

**File:** `tests/search/search-modal.spec.ts`

**Steps:**
  1. Open search modal using search button
    - expect: Search modal opens with search input field
    - expect: Modal shows 'No recent searches' initially
    - expect: Keyboard shortcuts (⌘K) are displayed
    - expect: Search input field is focused and ready for input
  2. Open search modal using keyboard shortcut Cmd+K/Ctrl+K
    - expect: Search modal opens same as clicking search button
    - expect: Search input is immediately focused
  3. Close search modal using Escape key
    - expect: Search modal closes completely
    - expect: Focus returns to page content
    - expect: Page content is accessible again

#### 3.2. Search Results and Functionality

**File:** `tests/search/search-results.spec.ts`

**Steps:**
  1. Search for 'locator' term
    - expect: Search results appear grouped by categories (Guides, Classes)
    - expect: Locators documentation page appears in Guides section
    - expect: Locator API class appears in Classes section
    - expect: Search terms are highlighted in results
    - expect: Results are clickable and lead to correct pages
  2. Search for common terms like 'test', 'browser', 'page'
    - expect: Relevant results appear for each search term
    - expect: Results include both documentation guides and API references
    - expect: Search is fast and responsive
    - expect: Result descriptions provide helpful context
  3. Test search navigation and selection
    - expect: Arrow keys navigate through search results
    - expect: Enter key selects highlighted result
    - expect: Clicking results navigates to correct page
    - expect: Search modal closes after selection
  4. Search for non-existent terms
    - expect: Appropriate 'no results' message is shown
    - expect: Search interface remains functional
    - expect: User can clear search and try again

### 4. Language Switcher

**Seed:** `tests/seed.spec.ts`

#### 4.1. Language Switcher Functionality

**File:** `tests/language-switcher/language-switching.spec.ts`

**Steps:**
  1. Verify default language selection on homepage
    - expect: Language switcher shows 'Node.js' as default
    - expect: Content is appropriate for Node.js/TypeScript users
    - expect: Code examples use JavaScript/TypeScript syntax
  2. Click language switcher dropdown
    - expect: Dropdown opens showing all available languages: Node.js, Python, Java, .NET
    - expect: Current selection (Node.js) is highlighted or marked
    - expect: All options are clickable
  3. Switch to Python documentation
    - expect: URL changes to include '/python/' prefix
    - expect: Language switcher shows 'Python' as selected
    - expect: Page content updates to Python-specific documentation
    - expect: Code examples use Python syntax
    - expect: Navigation structure remains consistent
  4. Switch to Java documentation
    - expect: URL changes to include '/java/' prefix
    - expect: Language switcher shows 'Java' as selected
    - expect: Content updates to Java-specific documentation
    - expect: Code examples use Java syntax
  5. Switch to .NET documentation
    - expect: URL changes to include '/dotnet/' prefix
    - expect: Language switcher shows '.NET' as selected
    - expect: Content updates to .NET-specific documentation
    - expect: Code examples use C# syntax

#### 4.2. Language-Specific Content Consistency

**File:** `tests/language-switcher/language-content-consistency.spec.ts`

**Steps:**
  1. Verify similar page structure across languages
    - expect: All languages have equivalent Getting Started sections
    - expect: API reference is available for each language
    - expect: Community sections exist for each language
    - expect: Navigation structure is consistent across languages
  2. Test search functionality in different languages
    - expect: Search works in Python documentation
    - expect: Search works in Java documentation
    - expect: Search works in .NET documentation
    - expect: Search results are language-specific and relevant
  3. Verify language persistence during navigation
    - expect: Selected language persists when navigating between docs sections
    - expect: URLs maintain language prefix throughout navigation
    - expect: Language switcher continues to show correct selection

### 5. API Reference Navigation

**Seed:** `tests/seed.spec.ts`

#### 5.1. API Reference Structure

**File:** `tests/api/api-reference-navigation.spec.ts`

**Steps:**
  1. Navigate to API reference section
    - expect: API sidebar shows 'API reference' section
    - expect: Main Playwright class is listed
    - expect: Classes section is expanded showing all API classes
    - expect: Classes include: Browser, Page, Locator, ElementHandle, etc.
  2. Navigate through different API classes
    - expect: Clicking Locator class loads Locator API documentation
    - expect: Page class documentation loads properly
    - expect: Browser class documentation is accessible
    - expect: Each class page shows methods, properties, and examples
  3. Verify API documentation completeness
    - expect: Each API class has detailed method documentation
    - expect: Code examples are provided for methods
    - expect: Parameters and return types are documented
    - expect: Navigation between related classes works smoothly

#### 5.2. API Reference Cross-Language Consistency

**File:** `tests/api/api-cross-language.spec.ts`

**Steps:**
  1. Compare API reference across different languages
    - expect: Similar API classes exist across Node.js, Python, Java, .NET
    - expect: Method names and functionality are consistent across languages
    - expect: Language-specific syntax is correctly shown in examples
    - expect: API structure follows same organization pattern
  2. Test API reference search across languages
    - expect: Searching for 'Locator' shows results in current language
    - expect: API method searches return language-appropriate results
    - expect: Cross-references between classes work properly

### 6. Community Section

**Seed:** `tests/seed.spec.ts`

#### 6.1. Community Navigation and Content

**File:** `tests/community/community-navigation.spec.ts`

**Steps:**
  1. Navigate to Community section
    - expect: Community welcome page loads with introduction
    - expect: Sidebar shows community navigation: Welcome, Ambassadors, Videos, Blog, Discord
    - expect: Videos section can be expanded to show subsections
    - expect: External links (Blog, Discord) are properly marked
  2. Explore Videos subsections
    - expect: Conference Videos page loads with video content
    - expect: Release Videos page is accessible
    - expect: Live Streams page is available
    - expect: Feature Videos and Learn Videos pages load properly
    - expect: MCP & Agent Videos section is present
  3. Test external community links
    - expect: Blog link opens to dev.to/playwright (external)
    - expect: Discord link opens to Discord server invitation
    - expect: GitHub repository link in header works correctly
    - expect: External links open in new tab/window

### 7. Theme and Accessibility

**Seed:** `tests/seed.spec.ts`

#### 7.1. Dark Mode Functionality

**File:** `tests/accessibility/dark-mode.spec.ts`

**Steps:**
  1. Click dark/light mode toggle button
    - expect: Theme toggles between light and dark modes
    - expect: Color scheme changes appropriately throughout site
    - expect: Text remains readable in both modes
    - expect: Button icon updates to reflect current mode
    - expect: User preference is maintained during navigation
  2. Verify theme consistency across pages
    - expect: Theme preference persists when navigating to docs, API, community
    - expect: All page elements respect the selected theme
    - expect: Code examples maintain proper syntax highlighting in both themes

#### 7.2. Accessibility and Keyboard Navigation

**File:** `tests/accessibility/keyboard-navigation.spec.ts`

**Steps:**
  1. Test keyboard navigation through main navigation
    - expect: Tab key moves through all navigation elements in logical order
    - expect: Enter key activates navigation links
    - expect: Focus indicators are visible and clear
    - expect: Skip to main content link works properly
  2. Test keyboard navigation in sidebar
    - expect: Sidebar navigation is keyboard accessible
    - expect: Tab/Shift+Tab moves through sidebar items correctly
    - expect: Enter/Space activates sidebar links and toggles
    - expect: Arrow keys can navigate within expanded sections
  3. Verify screen reader accessibility features
    - expect: All interactive elements have proper ARIA labels
    - expect: Navigation landmarks are properly defined
    - expect: Headings follow logical hierarchy
    - expect: Images have appropriate alt text

### 8. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 8.1. 404 and Error Page Handling

**File:** `tests/error-handling/error-pages.spec.ts`

**Steps:**
  1. Navigate to non-existent documentation page
    - expect: 404 error page is displayed with helpful information
    - expect: Navigation remains functional on error page
    - expect: User can return to valid pages from error page
    - expect: Search functionality works from error page
  2. Test broken internal links (if any)
    - expect: Broken links are handled gracefully
    - expect: User is informed of the issue
    - expect: Alternative navigation options are provided

#### 8.2. Performance and Loading

**File:** `tests/error-handling/performance.spec.ts`

**Steps:**
  1. Test page loading performance
    - expect: Homepage loads within reasonable time (< 3 seconds)
    - expect: Documentation pages load quickly
    - expect: Search results appear promptly
    - expect: Language switching is responsive
  2. Test navigation performance
    - expect: Sidebar navigation is responsive
    - expect: Page transitions are smooth
    - expect: No apparent memory leaks during extended navigation
    - expect: Search functionality remains fast with multiple queries
