---
title: Basic Form
description: Update a policy through a remote form.
section: Lessons
order: 5
difficulty: beginner
status: planned
duration: 20
primitives:
  - form
fixtures:
  - policies
topics:
  - remote-functions
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
	difficulty="beginner"
	status="planned"
	duration={20}
	primitives={["form"]}
	fixtures={["policies"]}
/>

## Objective

Update a policy using a remote form.

## Scenario

An operator toggles production approval requirements.

## Provided Data

Fixture source: `src/lib/mock/fixtures/policies.json`.

<FixtureViewer name="policies.json" data={fixtureData} />

## Expected Result

policy1 reflects the submitted values after save.

## Exercise

Build a form that PATCHes `policy1` fields via `form`.

Starter component: `#lib/examples/05-basic-form/Example.svelte`.

## Live Example

<ExamplePlaceholder lesson="Basic Form" status="planned" />

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
