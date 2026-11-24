---
title: Reactive Query
description: Filter projects by a selected status.
section: Lessons
order: 3
difficulty: beginner
status: planned
duration: 20
primitives:
  - query
fixtures:
  - projects
topics:
  - remote-functions
  - reactivity
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/projects.json';
</script>

<LessonMetadata
	difficulty="beginner"
	status="planned"
	duration={20}
	primitives={["query"]}
	fixtures={["projects"]}
/>

## Objective

Filter projects by a UI-selected status using a reactive remote query.

## Scenario

An operator focuses the fleet list on degraded or offline projects.

## Provided Data

Fixture source: `src/lib/mock/fixtures/projects.json`.

<FixtureViewer name="projects.json" data={fixtureData} />

## Expected Result

Only projects matching the selected status are shown.

## Exercise

Bind a status selector to a query argument and re-fetch when it changes.

Starter component: `#lib/examples/03-reactive-query/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Reactive Query" status="planned" />

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
