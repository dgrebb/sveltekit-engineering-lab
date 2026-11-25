---
title: Mock API Reference
description: Collection-based REST endpoints over the fixture store.
section: Reference
order: 1
---

<script>
	import { Callout } from 'svelte-docsmith';
	import ResetFixtureButton from '#lib/components/lab/ResetFixtureButton.svelte';
</script>

The mock API exposes the same session-scoped fixture store used by remote functions.
Successful reads return plain JSON arrays or objects — no response envelope.

## Available collections

`projects`, `agents`, `policies`, `runs`, `approvals`, `readiness`, `metrics`, `events`, `capabilities`

## Endpoints

| Method | Endpoint | Purpose | Status |
| --- | --- | --- | --- |
| GET | `/api/mock/{collection}` | List resources | 200 |
| GET | `/api/mock/{collection}/{id}` | Retrieve resource | 200 |
| POST | `/api/mock/{collection}` | Create resource | 201 |
| PATCH | `/api/mock/{collection}/{id}` | Update resource | 200 |
| DELETE | `/api/mock/{collection}/{id}` | Remove resource | 204 |
| POST | `/api/mock/reset` | Restore seed state | 200 |

## Query parameters

| Param | Applies to | Notes |
| --- | --- | --- |
| `limit` | list | Non-negative integer |
| `offset` | list | Non-negative integer |
| `status` | projects, agents, runs, approvals | Exact match |
| `projectId` | runs, approvals, readiness | Exact match |
| `agentId` | runs, metrics | Exact match |

Unsupported filters return `400` with `INVALID_FILTER`.

## Explore with curl

SvelteKit CSRF checks require a matching `Origin` on mutating requests. Browser
`fetch` sends this automatically; curl needs it explicitly. Reuse a cookie jar so
session-scoped mutations stick across calls.

```bash
JAR=/tmp/cpl-cookies.txt
ORIGIN=http://localhost:5173

# List projects
curl -s -c "$JAR" -b "$JAR" "$ORIGIN/api/mock/projects"

# Get project p1
curl -s -c "$JAR" -b "$JAR" "$ORIGIN/api/mock/projects/p1"

# Filter agents by status
curl -s -c "$JAR" -b "$JAR" "$ORIGIN/api/mock/agents?status=idle"

# Paginate events
curl -s -c "$JAR" -b "$JAR" "$ORIGIN/api/mock/events?limit=5&offset=0"

# Create a run
curl -s -c "$JAR" -b "$JAR" -X POST "$ORIGIN/api/mock/runs" \
  -H "Origin: $ORIGIN" \
  -H 'content-type: application/json' \
  -d '{"agentId":"a1","projectId":"p1","status":"pending","progress":0}'

# Update a policy
curl -s -c "$JAR" -b "$JAR" -X PATCH "$ORIGIN/api/mock/policies/policy1" \
  -H "Origin: $ORIGIN" \
  -H 'content-type: application/json' \
  -d '{"maxConcurrentRuns":5}'

# Delete an event
curl -s -c "$JAR" -b "$JAR" -o /dev/null -w '%{http_code}\n' \
  -X DELETE "$ORIGIN/api/mock/events/e27" \
  -H "Origin: $ORIGIN"

# Reset all fixtures for this session
curl -s -c "$JAR" -b "$JAR" -X POST "$ORIGIN/api/mock/reset" \
  -H "Origin: $ORIGIN"

# Reset one collection
curl -s -c "$JAR" -b "$JAR" -X POST "$ORIGIN/api/mock/reset" \
  -H "Origin: $ORIGIN" \
  -H 'content-type: application/json' \
  -d '{"collection":"agents"}'
```

## Example responses

### GET `/api/mock/projects`

```json
[
  { "id": "p1", "name": "engineering-lab", "status": "healthy" },
  { "id": "p2", "name": "agent-runtime", "status": "degraded" },
  { "id": "p3", "name": "tool-gateway", "status": "offline" }
]
```

### GET `/api/mock/projects/p1`

```json
{ "id": "p1", "name": "engineering-lab", "status": "healthy" }
```

### GET `/api/mock/projects/p99` — 404

```json
{
  "code": "NOT_FOUND",
  "message": "Project p99 does not exist."
}
```

### POST `/api/mock/agents` — invalid body — 400

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid type: Expected boolean but received undefined"
}
```

## Mutation payloads

Create/update bodies follow the Valibot input schemas in `#lib/schemas/entities.ts`.
Ids are optional on create; the store generates predictable identifiers (`p4`, `a4`, …).

## Reset behavior

`POST /api/mock/reset` restores seed fixtures for the **current session** only.
Omit the body to reset every collection, or pass `{ "collection": "runs" }` for one.

<ResetFixtureButton />

<Callout variant="note" title="Cookies matter">

curl examples that mutate state need the same session cookie across requests
(`-c` / `-b` jar) if you want to observe your own mutations.

</Callout>

## Quick links

- [GET projects](/api/mock/projects)
- [GET agents](/api/mock/agents)
- [GET policies](/api/mock/policies)
- [GET runs](/api/mock/runs)
- [GET approvals](/api/mock/approvals)
- [GET readiness](/api/mock/readiness)
- [GET metrics](/api/mock/metrics)
- [GET events](/api/mock/events)
- [GET capabilities](/api/mock/capabilities)
