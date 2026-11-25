---
title: Basic Query
description: Retrieve server-owned project data.
section: Lessons
order: 1
difficulty: beginner
status: complete
duration: 15
primitives:
  - query
fixtures:
  - projects
topics:
  - remote-functions
  - server-state
---

<script>
	import { LiveExample } from 'svelte-docsmith';
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ResetFixtureButton from '#lib/components/lab/ResetFixtureButton.svelte';
	import Example from '#lib/examples/01-basic-query/Example.svelte';
	import exampleSource from '#lib/examples/01-basic-query/Example.svelte?source';
	import fixtureData from '#lib/mock/fixtures/projects.json';
	const expected = fixtureData;
</script>

<LessonMetadata
	difficulty="beginner"
	status="complete"
	duration={15}
	primitives={["query"]}
	fixtures={["projects"]}
/>

## Objective

Return all projects from the fixture store via a remote query.

## Scenario

An operator opens the control plane and needs the current project list.

## Provided Data

Fixture source: `src/lib/mock/fixtures/projects.json`.

<FixtureViewer name="projects.json" data={fixtureData} />

## Expected Result

<ExpectedResult data={expected} />

## Exercise

Implement a remote `query` that lists every project and render the results.

Starter component: `#lib/examples/01-basic-query/Example.svelte`.

## Live Example

<LiveExample source={exampleSource}>
	<Example />
</LiveExample>

<ResetFixtureButton collection="projects" />

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
- [$app/server](https://svelte.dev/docs/kit/$app-server)
