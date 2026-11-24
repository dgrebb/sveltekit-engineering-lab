---
title: Loading and Async Boundaries
description: Explore pending and resolved query states.
section: Lessons
order: 19
difficulty: intermediate
status: planned
duration: 20
primitives:
  - query
fixtures:
  - projects
topics:
  - async
  - loading
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/projects.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={20}
	primitives={["query"]}
	fixtures={["projects"]}
/>

## Objective

Explore pending and resolved query states with async boundaries.

## Scenario

Slow queries should show pending UI instead of blank content.

## Provided Data

Fixture source: `src/lib/mock/fixtures/projects.json`.

<FixtureViewer name="projects.json" data={fixtureData} />

## Expected Result

Pending and resolved states are both observable.

## Exercise

Use `<svelte:boundary>` and/or query.loading while fetching projects.

Starter component: `#lib/examples/19-loading-and-async-boundaries/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Loading and Async Boundaries" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [await expressions](https://svelte.dev/docs/svelte/await-expressions)
- [svelte:boundary](https://svelte.dev/docs/svelte/svelte-boundary)
