---
title: Form Validation
description: Reject invalid concurrency values on policies.
section: Lessons
order: 6
difficulty: intermediate
status: planned
duration: 20
primitives:
  - form
fixtures:
  - policies
topics:
  - validation
  - forms
---

<script>
	import LessonMetadata from '#lib/components/lab/LessonMetadata.svelte';
	import FixtureViewer from '#lib/components/lab/FixtureViewer.svelte';
	import ExpectedResult from '#lib/components/lab/ExpectedResult.svelte';
	import ExamplePlaceholder from '#lib/components/lab/ExamplePlaceholder.svelte';
	import fixtureData from '#lib/mock/fixtures/policies.json';
</script>

<LessonMetadata
	difficulty="intermediate"
	status="planned"
	duration={20}
	primitives={["form"]}
	fixtures={["policies"]}
/>

## Objective

Reject invalid concurrency values before mutating policy state.

## Scenario

An operator accidentally sets max concurrent runs to zero or a huge number.

## Provided Data

Fixture source: `src/lib/mock/fixtures/policies.json`.

<FixtureViewer name="policies.json" data={fixtureData} />

## Expected Result

Invalid values are rejected; valid values update policy1.

## Exercise

Validate `maxConcurrentRuns` with a Standard Schema and surface field errors.

Starter component: `#lib/examples/06-form-validation/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Form Validation" status="planned" />

## Things to Investigate

- How the remote module is discovered (`.remote.ts` segment).
- Whether the exercise needs the fixture store directly or the mock HTTP API.
- How session isolation affects your mutations during experimentation.

## Observations

_Fill in during your exploration._

## Production Considerations

Ephemeral in-memory fixtures are for learning only. Production systems need durable storage, authorization, and observability.

## References

- [Remote functions — form](https://svelte.dev/docs/kit/remote-functions#form)
