---
title: Pagination and Filtering
description: Retrieve a subset of events.
section: Lessons
order: 15
difficulty: intermediate
status: planned
duration: 20
primitives:
  - query
fixtures:
  - events
topics:
  - pagination
  - filtering
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/events.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={20}
	primitives={["query"]}
	fixtures={["events"]}
/>

## Objective

Retrieve a subset of events with limit and offset.

## Scenario

An audit view pages through events.

## Provided Data

Fixture source: `src/lib/mock/fixtures/events.json`.

<FixtureViewer name="events.json" data={fixtureData} />

## Expected Result

A slice of the 27 seed events matching the requested window.

## Exercise

Support limit/offset against the events collection.

Starter component: `#lib/examples/15-pagination-and-filtering/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Pagination and Filtering" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Mock API](/docs/api-reference)
