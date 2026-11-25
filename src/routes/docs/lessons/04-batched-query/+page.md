---
title: Batched Query
description: Retrieve multiple agents by ID in one round trip.
section: Lessons
order: 4
difficulty: intermediate
status: planned
duration: 20
primitives:
  - query
  - query.batch
fixtures:
  - agents
topics:
  - remote-functions
  - batching
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/agents.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={20}
	primitives={["query","query.batch"]}
	fixtures={["agents"]}
/>

## Objective

Retrieve multiple agents by ID using batched queries.

## Scenario

A dashboard resolves several agent cards without N+1 requests.

## Provided Data

Fixture source: `src/lib/mock/fixtures/agents.json`.

<FixtureViewer name="agents.json" data={fixtureData} />

## Expected Result

Both agents returned without duplicate round trips.

## Exercise

Use `query.batch` (if available) to fetch agents `a1` and `a2`.

Starter component: `#lib/examples/04-batched-query/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Batched Query" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — query.batch](https://svelte.dev/docs/kit/remote-functions)
