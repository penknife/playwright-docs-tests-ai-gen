---
description: Run the full Playwright authoring pipeline (Planner → Generator → Healer) automatically for a feature or area of https://playwright.dev.
---

Run the **playwright-pipeline** orchestrator agent to produce a complete test suite end-to-end, without manual agent switching.

**Feature / area to cover:** ${input:feature:Describe the feature, page, or user flow to plan and test (e.g. "Homepage hero section" or "Docs sidebar navigation")}

Follow the strict sequence defined in `.github/copilot-instructions.md`:
1. Planner explores the app and saves `specs/*.md`. If the target feature or page cannot be found on https://playwright.dev, stop and report the issue instead of generating empty specs.
2. Generator transforms each spec item into `tests/**/*.spec.ts`.
3. Healer runs the suite and fixes failures until green or after 3 healing iterations, whichever comes first.

Return a single consolidated report at the end (spec path, generated files, healing outcome, next actions). Do not prompt for confirmation between phases.
