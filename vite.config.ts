import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { docsmith } from 'svelte-docsmith/vite';
import { customFields } from './src/lib/frontmatter.ts';

const title = 'Agentic Engineering Lab';

export default defineConfig({
	plugins: [
		docsmith({
			theme: 'graphite',
			site: {
				title,
				description:
					'Interactive documentation lab for exploring SvelteKit remote functions with agentic engineering entities and patterns.',
				nav: [
					{ label: 'Docs', href: '/docs/introduction' },
					{ label: 'Lessons', href: '/docs/lessons/01-basic-query' },
					{ label: 'API', href: '/docs/api-reference' },
					{ label: 'Fixtures', href: '/docs/fixture-reference' }
				],
				footer: {
					copyright: `© ${new Date().getFullYear()} Agentic Engineering Lab`
				}
			},
			schema: customFields,
			markdown: {
				lineNumbers: true
			}
		}),
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.md'],
			preprocess: [vitePreprocess()],
			adapter: adapter(),
			compilerOptions: {
				experimental: {
					async: true
				}
			},
			experimental: {
				remoteFunctions: true
			}
		})
	],
	// DocSmith serves virtual modules for `svelte-docsmith/site`, `/content`, etc.
	// Prebundling the package into `.vite/deps` resolves those specifiers to the
	// published fallbacks and breaks the client. Keep the package outside the
	// optimizer so the plugin can intercept. (Compatibility note: required for
	// DocSmith 0.29 + Vite 8 dependency optimization.)
	optimizeDeps: {
		exclude: ['svelte-docsmith']
	},
	ssr: {
		noExternal: ['svelte-docsmith']
	},
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		environment: 'node'
	}
});
