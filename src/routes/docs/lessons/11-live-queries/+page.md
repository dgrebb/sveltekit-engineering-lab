---
title: Live Queries
description: Observe changing run progress with a live query.
section: Lessons
order: 11
difficulty: advanced
status: planned
duration: 25
primitives:
  - query.live
fixtures:
  - runs
topics:
  - live-queries
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/runs.json';
</script>

<LessonMetadata
	difficulty="advanced"
	status="planned"
	duration={25}
	primitives={["query.live"]}
	fixtures={["runs"]}
/>

## Objective

Observe changing run progress with a live query.

## Scenario

A run progress bar should update as the server mutates progress.

## Provided Data

Fixture source: `src/lib/mock/fixtures/runs.json`.

<FixtureViewer name="runs.json" data={fixtureData} />

## Expected Result

Progress for run r1 updates as the underlying fixture changes.

## Exercise

Use `query.live` if available; otherwise document the limitation and leave pending.

Starter component: `#lib/examples/11-live-queries/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Live Queries" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — live queries](https://svelte.dev/docs/kit/remote-functions)
