---
title: Derived Server State
description: Evaluate whether all readiness checks passed.
section: Lessons
order: 13
difficulty: intermediate
status: planned
duration: 20
primitives:
  - query
fixtures:
  - readiness
topics:
  - derived-state
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/readiness.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={20}
	primitives={["query"]}
	fixtures={["readiness"]}
/>

## Objective

Evaluate whether all readiness checks passed on the server.

## Scenario

A release gate needs a single ready/not-ready signal.

## Provided Data

Fixture source: `src/lib/mock/fixtures/readiness.json`.

<FixtureViewer name="readiness.json" data={fixtureData} />

## Expected Result

ready === false because Security failed.

## Exercise

Return a derived boolean from readiness checks for project p1.

Starter component: `#lib/examples/13-derived-server-state/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Derived Server State" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — query](https://svelte.dev/docs/kit/remote-functions#query)
