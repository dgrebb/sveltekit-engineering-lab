---
title: Concurrent Mutations
description: Resolve competing approval updates.
section: Lessons
order: 12
difficulty: advanced
status: planned
duration: 25
primitives:
  - command
fixtures:
  - approvals
topics:
  - concurrency
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/approvals.json';
</script>

<LessonMetadata
	difficulty="advanced"
	status="planned"
	duration={25}
	primitives={["command"]}
	fixtures={["approvals"]}
/>

## Objective

Resolve competing approval updates without corrupting state.

## Scenario

Two operators approve and reject the same request nearly simultaneously.

## Provided Data

Fixture source: `src/lib/mock/fixtures/approvals.json`.

<FixtureViewer name="approvals.json" data={fixtureData} />

## Expected Result

Last successful write wins; errors surface for conflicts if modeled.

## Exercise

Issue overlapping updates to approval ap1 and observe final state.

Starter component: `#lib/examples/12-concurrent-mutations/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Concurrent Mutations" status="planned" />

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
