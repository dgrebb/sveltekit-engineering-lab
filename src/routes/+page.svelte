<script lang="ts">
	import { content } from 'svelte-docsmith/content';
	import { DocsShell, Hero, FeatureGrid, Feature, CTA, Action } from 'svelte-docsmith';
	import { site } from 'svelte-docsmith/site';
</script>

<DocsShell {content} layout="page" pattern>
	<Hero
		title={site.title}
		description="An interactive documentation lab for exploring SvelteKit remote functions through a lightweight AI Eng control-plane theme."
	>
		{#snippet actions()}
			<Action href="/docs/getting-started">Get started</Action>
			<Action href="/docs/lessons/01-basic-query" variant="secondary">Basic Query lesson</Action>
		{/snippet}
	</Hero>

	<FeatureGrid
		background="muted"
		title="Built for deliberate practice"
		description="Infrastructure first. You implement the exercises."
	>
		<Feature title="Remote functions">
			Opt-in SvelteKit 3 remote queries, forms, commands, and related experimental APIs.
		</Feature>
		<Feature title="DocSmith lessons">
			Markdown routes with automatic navigation, live examples, and source presentation.
		</Feature>
		<Feature title="Fixture store">
			Typed in-memory collections with validation, reset, and per-visitor isolation.
		</Feature>
		<Feature title="Mock REST API">
			The same data model over generic collection endpoints for HTTP-path lessons.
		</Feature>
		<Feature title="One reference lesson">
			Basic Query is complete end-to-end so conventions are visible before you explore.
		</Feature>
		<Feature title="Nineteen scaffolds">
			Objectives, fixtures, and expected results — without finished solutions.
		</Feature>
	</FeatureGrid>

	<CTA
		title="Start with Basic Query"
		description="See a working remote query, then pick the next planned lesson."
	>
		{#snippet actions()}
			<Action href="/docs/lessons/01-basic-query">Open the reference lesson</Action>
			<Action href="/docs/introduction" variant="secondary">Read the introduction</Action>
		{/snippet}
	</CTA>
</DocsShell>
