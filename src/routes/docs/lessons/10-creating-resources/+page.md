---
title: Creating Resources
description: Append a run record to the fixture store.
section: Lessons
order: 10
difficulty: beginner
status: planned
duration: 15
primitives:
  - command
  - form
fixtures:
  - runs
topics:
  - create
  - mutations
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/runs.json';
</script>

<LessonMetadata
	difficulty="beginner"
	status="planned"
	duration={15}
	primitives={["command","form"]}
	fixtures={["runs"]}
/>

## Objective

Append a run record to the runs collection.

## Scenario

An operator starts a new agent run against a project.

## Provided Data

Fixture source: `src/lib/mock/fixtures/runs.json`.

<FixtureViewer name="runs.json" data={fixtureData} />

## Expected Result

A new run appears in the list with a generated id.

## Exercise

Create a run with agentId, projectId, status, and progress.

Starter component: `#lib/examples/10-creating-resources/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Creating Resources" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — command](https://svelte.dev/docs/kit/remote-functions#command)
