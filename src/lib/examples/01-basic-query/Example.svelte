<script lang="ts">
	import { getProjects } from './example.remote.ts';

	const projects = await getProjects();
</script>

<div class="example">
	<h3>Projects</h3>
	<ul>
		{#each projects as project (project.id)}
			<li>
				<span class="name">{project.name}</span>
				<span class="status" data-status={project.status}>{project.status}</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	.example {
		padding: 0.25rem 0;
	}

	h3 {
		margin: 0 0 0.75rem;
		font-size: 1rem;
		font-weight: 600;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.5rem;
	}

	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.55rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background: var(--card);
	}

	.name {
		font-weight: 500;
	}

	.status {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--muted-foreground);
	}

	.status[data-status='healthy'] {
		color: var(--primary);
	}

	.status[data-status='degraded'] {
		color: var(--foreground);
	}
</style>
