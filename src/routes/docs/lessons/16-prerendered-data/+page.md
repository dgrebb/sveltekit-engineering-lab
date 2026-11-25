---
title: Prerendered Data
description: Publish a static capability catalog.
section: Lessons
order: 16
difficulty: intermediate
status: planned
duration: 20
primitives:
  - prerender
fixtures:
  - capabilities
topics:
  - prerender
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/capabilities.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={20}
	primitives={["prerender"]}
	fixtures={["capabilities"]}
/>

## Objective

Publish a static capability catalog with a prerender remote function.

## Scenario

Capability descriptions are stable and can ship in the HTML.

## Provided Data

Fixture source: `src/lib/mock/fixtures/capabilities.json`.

<FixtureViewer name="capabilities.json" data={fixtureData} />

## Expected Result

Capabilities c1 and c2 available without a dynamic query round trip.

## Exercise

Use `prerender` to expose the capabilities fixture.

Starter component: `#lib/examples/16-prerendered-data/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Prerendered Data" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — prerender](https://svelte.dev/docs/kit/remote-functions#prerender)
