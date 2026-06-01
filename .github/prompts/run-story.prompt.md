---
description: Run the Playwright pipeline for a specific user story with explicit acceptance criteria.
---

Run the **playwright-pipeline** orchestrator agent for the following user story.

**Story ID:** ${input:storyId:e.g. JIRA-1234}
**Story title:** ${input:storyTitle:Short, human-readable title}
**User story:** ${input:story:As a <role> I want <goal> so that <benefit>}
**Acceptance criteria (one per line, prefixed with AC-1, AC-2, ...):**
${input:criteria:AC-1: ...\nAC-2: ...\nAC-3: ...}
**Target URL or section on https://playwright.dev (optional):** ${input:target:e.g. /docs/api — leave blank for orchestrator to infer}

Instruct the orchestrator to:
1. Pass the story ID, story text, target hint, and acceptance criteria to the planner verbatim. The spec filename must include the story ID, e.g. `specs/<storyId>-<kebab-title>.md`.
2. Require that **every acceptance criterion maps to at least one test item** in the produced spec. Each test item in the spec must be tagged with the criterion IDs it covers (e.g. `Covers: AC-1, AC-3`).
3. If any acceptance criterion cannot be covered on https://playwright.dev (feature missing or out of scope), stop and report which criteria are uncovered instead of generating partial specs.
4. Run the generator once per test item and the healer with the iteration cap defined in the orchestrator (3 iterations max).

Return the standard consolidated report plus a **Criteria coverage** table mapping each `AC-N` → test file(s). Do not prompt for confirmation between phases.
