---
title: Aggregated Queries
description: Calculate total runs and failures across agents.
section: Lessons
order: 14
difficulty: intermediate
status: planned
duration: 15
primitives:
  - query
fixtures:
  - metrics
topics:
  - aggregation
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/metrics.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={15}
	primitives={["query"]}
	fixtures={["metrics"]}
/>

## Objective

Calculate total runs and failures from metrics.

## Scenario

An engineering lead wants fleet-wide agent throughput.

## Provided Data

Fixture source: `src/lib/mock/fixtures/metrics.json`.

<FixtureViewer name="metrics.json" data={fixtureData} />

## Expected Result

```json
{ "runs": 44, "failures": 3 }
```

## Exercise

Sum `runs` and `failures` across all metric rows.

Starter component: `#lib/examples/14-aggregated-queries/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Aggregated Queries" status="planned" />

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
