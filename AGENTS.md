# Repository Guidelines

## Scope and Related Instructions

These instructions apply throughout this repository. Read any nested `AGENTS.md` or `AGENTS.override.md` governing files you change; more specific instructions take precedence within their scope.

Topic-specific instructions live in `.agents/rules/*.md`. Read the applicable rule files before working on these areas. They supplement this file; they do not replace the repository-wide rules.

| Task area                                                                              | Required instructions            |
| -------------------------------------------------------------------------------------- | -------------------------------- |
| Test changes, validation scope, browser verification (Playwright), or artifact cleanup | [test.md](.agents/rules/test.md) |

When topic-specific rules grow beyond a few bullets, move them to `.agents/rules/<topic>.md` and add them to the table above. Keep general engineering rules here and topic rules in their owning file; avoid duplicating the same instruction across files, and update references when ownership changes.

## Working Rules

- Do not start or restart the development server; it is managed by the user.
- Implement only the current requirements. Keep trivial single-use helpers with their consumer; avoid speculative abstractions and unnecessary dependencies.
- Inspect the current code and configuration before editing. Preserve unrelated local changes and keep diffs focused on the task.
- When moving files, update imports, tooling entry points, and test mocks. Remove old files and empty directories instead of leaving compatibility re-exports.
- When changing dependencies, file locations, build outputs, or development workflows, update affected root and editor configuration (Git, formatter, linter, TypeScript, Vitest, Playwright, and `.vscode/`). Remove obsolete entries and verify changed ignore rules.

## Source Control

- Never commit secrets, credentials, `.env*` files, or authentication state. Only `.env.example` may be committed.
- Keep commits focused on one logical change. Use imperative, present-tense subjects (for example, `Add video upload form`) of at most 72 characters; explain the reason in the body when it is not obvious.
- Do not rewrite shared history: no force pushes, `git reset --hard`, or branch deletion unless the user explicitly requests it. Never skip hooks with `--no-verify`.
- Stage files by explicit path instead of `git add -A` or `git add .`.
- Commit or push only when the user asks for it. Run the checks selected by [test.md](.agents/rules/test.md) before committing.
- Line endings are normalized to LF through `.gitattributes` and Prettier.

## Tooling

- Use npm and the Node.js version declared in `engines` in `package.json`. Commit `package-lock.json` with every dependency change. Pin tooling versions exactly when their output changes between patch releases (TypeScript, Oxlint, Prettier).
- TypeScript 7 (the native Go compiler) is the type checker. Run it through `npm run typecheck`, which generates Next.js route types first. Do not reintroduce options removed in TypeScript 7, such as `baseUrl` or `moduleResolution: "node"`.
- Use Prettier for formatting and Oxlint for code quality. ESLint is not used; do not add it back. Follow the checked-in configurations (`.prettierrc.json`, `oxlint.config.ts`) and do not suppress diagnostics to pass checks. A suppression requires a comment explaining why the rule does not apply.
- Use Vitest for unit tests (`vitest.config.ts`) and Playwright for browser tests and interactive checks (`playwright.config.ts`, [playwright-cli skill](.agents/skills/playwright-cli/SKILL.md)).
- The development and production servers run on port 3003 (`npm run dev`, `npm start`). Next.js reads the port from the CLI flag, not from `.env*` files.
- Format changed files with `npx prettier --write <paths>`; use `npm run format` only for an intentional repository-wide format.

| Command                | Purpose                                           |
| ---------------------- | ------------------------------------------------- |
| `npm run format:check` | Verify formatting                                 |
| `npm run lint`         | Check code; errors and warnings fail              |
| `npm run lint:fix`     | Apply safe Oxlint fixes                           |
| `npm run typecheck`    | Generate Next.js route types and check TypeScript |
| `npm test`             | Run the Vitest suite once                         |
| `npm run test:e2e`     | Run Playwright tests against the running server   |
| `npm run build`        | Production build                                  |

- [test.md](.agents/rules/test.md) owns validation scope, test commands, and browser verification. The commands above check the whole repository; use focused checks where that guide allows them.

## Code Organization

- Routes live in `app/` and follow Next.js file conventions. Keep route files thin; place page presentation and logic in the owning feature.
- Keep domain code in `features/<domain>/`: UI in `components/`, browser logic shared by several components in `client/`, domain contracts, constants, and pure logic in `shared/`, and server-only code in `server/`. Create these directories only when needed.
- Under `server/`, place Server Actions in `actions/*-actions.ts`, HTTP handlers in `handlers/*-handler.ts`, services in `services/*-service.ts`, repositories in `repositories/*-repository.ts`, and external service clients (for example, AI model or storage providers) in `integrations/`. Expose server APIs consumed by other domains through `server/public.ts`.
- Keep technical utilities, configuration, and shared infrastructure in `lib/`. Keep component-specific hooks and helpers beside their consumers.
- Use kebab-case filenames, PascalCase component names, and named exports for regular components. Route files use the default exports Next.js requires.
- Import with the `@/` alias instead of long relative paths across directories.

## Type Contracts

- Accept `unknown` only at external-data and exception boundaries (request bodies, API responses, environment variables, storage, `catch`). Validate with a schema, type guard, or explicit parser before passing data into business logic. A type assertion or generic type argument is not runtime validation.
- Internal functions accept concrete domain types. Do not use `any`; use `as` assertions only with a comment explaining why the type is guaranteed.
- When runtime schemas exist, infer TypeScript types from them instead of maintaining duplicate declarations.
- Model normalized data with required fields and explicit nullability. Use discriminated unions for distinct states (for example, video generation `queued`, `processing`, `succeeded`, `failed`).
- Keep private types beside their consumer. Put contracts shared between server and UI in the owning domain's `shared/`. Browser code must not import server implementation types.
- Reserve `Record<string, unknown>` for genuinely open objects such as arbitrary JSON.

## Security

- Keep secrets in environment variables. Read them only in server code; expose values to the browser only through intentional `NEXT_PUBLIC_` variables that are safe to publish.
- Put local values in `.env.local` (ignored). Document every variable in the committed `.env.example` without real values, and keep both files in sync when adding or removing variables.
- Validate and authorize all input in Server Actions and route handlers; never trust client-provided identifiers, prices, or quotas.
- Never log secrets, tokens, or user-uploaded content.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
