---
title: Upstream API Integration
description: Consume the mock REST API from a remote function.
section: Lessons
order: 17
difficulty: intermediate
status: planned
duration: 20
primitives:
  - query
fixtures:
  - projects
topics:
  - http
  - fetch
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

Consume the mock REST API from a remote function using request-scoped fetch.

## Scenario

Some lessons intentionally go through HTTP instead of the store API.

## Provided Data

Fixture source: `src/lib/mock/fixtures/projects.json`.

<FixtureViewer name="projects.json" data={fixtureData} />

## Expected Result

Same project list as the direct store path.

## Exercise

Call `GET /api/mock/projects` from a remote query.

Starter component: `#lib/examples/17-upstream-api-integration/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Upstream API Integration" status="planned" />

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
- [Web standards](https://svelte.dev/docs/kit/web-standards)
