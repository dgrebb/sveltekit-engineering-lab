---
title: Error Handling
description: Handle invalid IDs and rejected mutations.
section: Lessons
order: 18
difficulty: intermediate
status: planned
duration: 20
primitives:
  - query
  - command
fixtures:
  - agents
topics:
  - errors
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
	primitives={["query","command"]}
	fixtures={["agents"]}
/>

## Objective

Handle invalid IDs and rejected mutations gracefully.

## Scenario

A stale UI requests agent a99 which does not exist.

## Provided Data

Fixture source: `src/lib/mock/fixtures/agents.json`.

<FixtureViewer name="agents.json" data={fixtureData} />

## Expected Result

Clear error messaging without crashing the page.

## Exercise

Surface NOT_FOUND and VALIDATION_ERROR responses in the UI.

Starter component: `#lib/examples/18-error-handling/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Error Handling" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Errors](https://svelte.dev/docs/kit/errors)
- [svelte:boundary](https://svelte.dev/docs/svelte/svelte-boundary)
