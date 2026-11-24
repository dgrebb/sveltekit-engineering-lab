<script lang="ts">
	const {
		lesson,
		status = 'planned'
	}: {
		lesson: string;
		status?: 'planned' | 'exploring' | 'complete';
	} = $props();
</script>

<aside class="example-placeholder" data-status={status}>
	<p class="label">Live example</p>
	<p>
		{#if status === 'complete'}
			Reference implementation for <strong>{lesson}</strong>.
		{:else}
			Exercise scaffold for <strong>{lesson}</strong> — implement the remote function and UI
			yourself. See <code>#lib/examples/</code> for the starter component.
		{/if}
	</p>
</aside>

<style>
	.example-placeholder {
		margin: 1rem 0;
		padding: 1rem 1.1rem;
		border: 1px dashed var(--border);
		border-radius: 0.5rem;
		background: var(--muted);
		color: var(--muted-foreground);
		font-size: 0.9rem;
	}

	.label {
		margin: 0 0 0.35rem;
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--foreground);
	}

	p {
		margin: 0;
		line-height: 1.5;
	}

	code {
		font-size: 0.85em;
	}
</style>
