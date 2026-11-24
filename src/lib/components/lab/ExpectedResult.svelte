<script lang="ts">
	const { data }: { data: unknown } = $props();
	const json = $derived(JSON.stringify(data, null, 2));
</script>

<figure class="expected-result">
	<figcaption>Expected result</figcaption>
	<pre><code>{json}</code></pre>
</figure>

<style>
	.expected-result {
		margin: 1rem 0;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--card);
	}

	figcaption {
		padding: 0.5rem 0.85rem;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted-foreground);
		border-bottom: 1px solid var(--border);
		background: var(--muted);
	}

	pre {
		margin: 0;
		padding: 0.85rem 1rem;
		overflow-x: auto;
		font-size: 0.8125rem;
		line-height: 1.45;
	}

	code {
		font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
	}
</style>
