/**
 * Shared Svelte language options for ESLint.
 * SvelteKit 3 configures the compiler via the Vite plugin; ESLint still needs
 * a lightweight config object for svelte-eslint-parser.
 */
export default {
	compilerOptions: {
		runes: true,
		experimental: {
			async: true
		}
	}
};
