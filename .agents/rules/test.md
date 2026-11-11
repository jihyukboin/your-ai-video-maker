# Testing Guidelines

## Scope

Read this file when adding or changing tests, choosing validation scope, verifying browser behavior, or handling test artifacts. Follow [AGENTS.md](../../AGENTS.md) for repository-wide engineering rules.

## Validation Scope

Choose the smallest set of checks that verifies the changed behavior and its consumers. Expand only when shared impact, failures, or unresolved concerns justify it; do not run every available check by default.

| Change                    | Required checks                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation only        | Format the changed documents. Skip lint, typecheck, tests, builds, and browser checks.                                                                            |
| Application code          | Format and lint changed files; run typecheck; run existing tests relevant to the changed behavior.                                                                |
| Tests only                | Format and lint changed test files; run the affected tests and typecheck.                                                                                         |
| Shared or cross-cutting   | Run the full Vitest suite and repository-wide lint and typecheck. Use repository-wide lint for lint configuration changes.                                        |
| Tooling or configuration  | Run the checks affected by that configuration. Build only when build, bundling, or dependency behavior needs verification.                                        |
| UI behavior or appearance | Apply the code checks above and verify the affected browser flow or visual result. Run a covering E2E test when available; use interactive verification for gaps. |

- For overlapping rows, combine applicable checks once. After they pass, stop unless later edits or new evidence invalidate the result. Do not repeat the same browser assertions interactively after a covering E2E test passes.
- A full production build is not a routine final check.

| Scope             | Example command                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Changed documents | `npx prettier --write AGENTS.md .agents/rules/test.md`                                                                                |
| Changed code      | `npx prettier --write app/page.tsx` then `npx oxlint app/page.tsx --max-warnings 0 --report-unused-disable-directives-severity error` |
| Application types | `npm run typecheck`                                                                                                                   |
| One unit test     | `npm test -- test/video/timeline.test.ts`                                                                                             |
| One domain        | `npm test -- test/video`                                                                                                              |
| Full unit suite   | `npm test`                                                                                                                            |
| One E2E file      | `npm run test:e2e -- test/e2e/home.spec.ts`                                                                                           |
| E2E on other port | `PLAYWRIGHT_BASE_URL=http://localhost:3004 npm run test:e2e`                                                                          |

Use actual changed paths and affected domains in these examples. `npm test` runs Vitest once and does not need a browser or development server; arguments after `--` select files or domains. Successful formatting with `--write` needs no separate formatting check on unchanged files.

## Test Organization

- Keep unit tests under `test/<domain>/*.test.ts` or `*.test.tsx`, importing source modules directly through the `@/` alias. Tests and fixtures are included in TypeScript checking.
- Keep Playwright Test scenarios under `test/e2e/*.spec.ts`. `playwright.config.ts` targets Chromium and `http://localhost:3003` by default and has no `webServer` command; it must not start the user-managed server.
- Use Vitest for domain logic and synchronous components. Async Server Component rendering and browser interactions belong in Playwright coverage, following the [Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest) and [Playwright guide](https://nextjs.org/docs/app/guides/testing/playwright).
- Use `vi.mock`, `vi.doMock`, `vi.fn`, `vi.mocked`, or `vi.spyOn` at dependency boundaries with concrete contracts and typed fixtures. Mocks are restored after each test by configuration; use `vi.resetModules` only when module initialization needs isolation.
- Keep mocks as TypeScript code. Do not generate mock source strings, invoke bundlers from tests, or implement custom module loaders. Share only fixtures or setup that several tests actually need.
- In E2E tests, use accessible locators (`getByRole`, `getByLabel`, `getByText`) and web-first assertions (`await expect(locator).toBeVisible()`). Avoid fixed timeouts and CSS selectors tied to styling.
- Test observable behavior and meaningful edge cases. Avoid tests that mirror implementation details, unnecessary tests for reversible low-impact changes, and speculative test helpers.
- Keep temporary verification scripts separate from maintained regression tests. Add lasting regression coverage only when the current task justifies it.

## Browser Workflow

- Use the [playwright-cli skill](../skills/playwright-cli/SKILL.md) for headless navigation, clicks, input, and UI verification. Run the repository-local CLI with `npx --no-install playwright cli` so the lockfile's version is used; do not install a global CLI. The default browser is headless Chromium, configured in `.playwright/cli.config.json`.
- For ordinary checks, navigate directly to the target URL. Use Next DevTools MCP (`nextjs_index`, then `nextjs_call`) only when the local server address is unknown or server-side errors, routes, or logs are needed. Recheck runtime errors after reproduction when investigating a runtime issue.
- If a required server is unavailable, report the blocked check. Do not start or restart the user-managed server or repeat discovery without evidence that availability changed.
- Start with snapshots and element refs or targeted locators. Capture screenshots only when visual verification requires them or the user requests them.
- Use a distinct named session for each independent task and close only that session when finished:

```bash
npx --no-install playwright cli -s=video-maker-check open http://localhost:3003
npx --no-install playwright cli -s=video-maker-check snapshot
# Use an element ref from the current snapshot for click/fill commands.
npx --no-install playwright cli -s=video-maker-check console error
npx --no-install playwright cli -s=video-maker-check close
```

## Setup

```bash
npm ci
npx --no-install playwright install chromium
```

- The skill under `.agents/skills/playwright-cli/` is copied from the shared `agent-skills` repository. Refresh it from there after updating Playwright; do not edit it here. Prettier ignores it to preserve the upstream text.
- After changing `.codex/config.toml`, start a new agent session so MCP servers reload.

## Temporary Files and Cleanup

- Unless the user explicitly requests retention, remove temporary tests, verification scripts, screenshots, snapshots, traces, videos, logs, and reports created for the task after using them. This applies to files outside the repository as well.
- Use the ignored directories `.playwright-cli/`, `test-results/`, and `playwright-report/` for browser artifacts. An ignored path is not permission to leave files behind.
- Inspect failure artifacts as needed (for example, `npx --no-install playwright show-report`), then clean them up before finishing, including when a check fails or is blocked. Do not delete pre-existing files, maintained regression tests, or artifacts belonging to other tasks or sessions.
- If the user requests an artifact, keep only the requested files at the agreed location and report their paths. Never commit credentials or authentication state.

## Reporting

- Briefly report checks performed and results, plus relevant failures, blocked checks, or verification gaps. Do not enumerate checks that were inapplicable. For browser verification, include the tested URL and the actions or assertions performed.
- Distinguish failures in changed files from pre-existing diagnostics. Static checks do not establish browser, runtime, or deployment behavior.
