---
title: Parameterized Query
description: Retrieve a single project by id.
section: Lessons
order: 2
difficulty: beginner
status: planned
duration: 15
primitives:
  - query
fixtures:
  - projects
topics:
  - remote-functions
  - validation
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
	duration={15}
	primitives={["query"]}
	fixtures={["projects"]}
/>

## Objective

Retrieve project `p1` using a parameterized remote query.

## Scenario

An operator drills into one project from the fleet overview.

## Provided Data

Fixture source: `src/lib/mock/fixtures/projects.json`.

<FixtureViewer name="projects.json" data={fixtureData} />

## Expected Result

```json
{ "id": "p1", "name": "control-plane", "status": "healthy" }
```

## Exercise

Accept a project id argument, validate it, and return that project.

Starter component: `#lib/examples/02-parameterized-query/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Parameterized Query" status="planned" />

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
