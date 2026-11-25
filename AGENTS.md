# Agent guidance — Agentic Engineering Lab

Persistent instructions for coding agents working in this repository.

## Non-negotiables

- Follow **SvelteKit 3** conventions only. Do not reintroduce `svelte.config.js`, `$lib`, `$app/environment`, `$app/stores`, or deprecated Kit response helpers.
- Configure SvelteKit exclusively through the `sveltekit()` Vite plugin in `vite.config.ts`.
- Keep `experimental.remoteFunctions` and `compilerOptions.experimental.async` enabled.
- Use **pnpm exclusively** for JavaScript dependency management and scripts.
- Use `#lib/...` imports **with file extensions** (`.ts`, `.svelte`, `.json`).
- Prefer Svelte 5 runes (`$state`, `$derived`, `$props`), snippets over slots, and native async patterns.
- Import remote functions and related types from `$app/server`.
- Import hook types such as `Handle` from `@sveltejs/kit/hooks`.
- Use native `Response` / `Response.json()` in endpoints.

## Before changing experimental APIs

Verify remote-function, async-component, and related APIs against current official documentation:

- https://svelte.dev/docs/kit/remote-functions
- https://svelte.dev/docs/kit/migrating-to-sveltekit-3
- https://svelte.dev/docs/kit/$app-server

If an API changed or is unavailable, document the limitation and leave the lesson pending. Do not invent substitutes.

## Lesson boundaries

- Preserve independent lesson examples under `src/lib/examples/<id>/`.
- Prefer clarity over premature shared abstractions across lessons.
- **Do not solve unfinished exercises** unless the user explicitly requests it.
- Only **Basic Query** (`01-basic-query`) ships as a complete reference implementation by default.

## Fixtures and mock infrastructure

- Keep fixtures simple and realistic enough for SDLC teaching themes.
- Do not expand domain relationships, orchestration logic, or speculative metadata.
- The fixture store is not a domain service layer — no agent execution, CI, or policy engines.
- Mutable state is session-scoped via an anonymous cookie; do not add auth solely for isolation.
- Document that state is ephemeral and resets on server restart.

## Documentation

- Prefer DocSmith for Markdown routes, navigation, live examples, and source presentation.
- Do not build a second content index or custom Markdown compiler.
- Keep README / AGENTS / lesson pages accurate as examples evolve.
- Use Mermaid diagrams when they improve understanding of data flow or lesson structure.

## DocSmith

- Official docs: https://docsmith.geodask.com
- Plugin: `docsmith()` before `sveltekit()` in `vite.config.ts`
- Custom lesson frontmatter schema: `#lib/frontmatter.ts`
- Live examples: import the component and the same file with `?source`

## Compatibility caution

Do not silently downgrade SvelteKit, Vite, Svelte, or TypeScript to accommodate tooling. If DocSmith or a transitive dependency conflicts with Kit 3, document the exact issue and the smallest viable remediation; do not fork without approval.

Preserve `optimizeDeps.exclude: ['svelte-docsmith']` (and related SSR settings) in `vite.config.ts`. Removing them causes the client to load DocSmith fallback modules and blank the UI under Vite 8.

## Explicit non-goals

Do not implement AI agents, MCP, CI/CD, GitHub integrations, real authz engines, databases, job queues, WebSockets, TanStack Query, Redux, or custom documentation engines unless the user explicitly expands scope.

## Validation before finishing

```bash
pnpm check
pnpm lint
pnpm test
pnpm build
```
