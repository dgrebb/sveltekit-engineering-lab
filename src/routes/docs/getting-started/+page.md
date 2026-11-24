---
title: Getting Started
description: Run the lab and complete your first lesson.
section: Getting Started
order: 2
---

<script>
	import { Callout } from 'svelte-docsmith';
</script>

## Prerequisites

- Node.js **22.17+**
- **pnpm** (see `packageManager` in `package.json`)

## Install and run

```bash
pnpm install
pnpm dev
```

Open [/docs/lessons/01-basic-query](/docs/lessons/01-basic-query). The live example loads
projects through a remote `query`.

## Project conventions

| Concern | Convention |
| --- | --- |
| Imports | `#lib/...` with file extensions |
| Config | `vite.config.ts` only — no `svelte.config.js` |
| Remote modules | `*.remote.ts` anywhere except `server/` directories |
| Fixtures | `src/lib/mock/fixtures/*.json` |
| Store / API | `src/lib/server/mock/` and `/api/mock/*` |

## Session isolation

Mutable fixture state is keyed by an anonymous `cpl_session` cookie. Visitors do not share
mutations. State is ephemeral and resets when the server process restarts, or when you call
`POST /api/mock/reset`.

<Callout variant="note" title="No auth required">

The session cookie exists only to isolate lab experiments. There is no login flow.

</Callout>

## Next steps

1. Study the [Basic Query](/docs/lessons/01-basic-query) reference.
2. Browse the [Fixture reference](/docs/fixture-reference) and [API reference](/docs/api-reference).
3. Pick a planned lesson and implement its exercise.
