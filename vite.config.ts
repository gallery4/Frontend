import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { vite as vidstack } from 'vidstack/plugins';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [tailwindcss(), vidstack(), sveltekit(), devtoolsJson()],
		resolve: {
			alias: [{ find: 'path', replacement: 'path-browserify' }]
		},

		// TODO: pdflib's service worker causes vidstack to work erraticly.
		// this is temporary disable the error of missing DOMMatrix.
		server:{
			hmr:{
				overlay: false
			}
		}
	};
});
