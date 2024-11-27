import { sveltekit } from '@sveltejs/kit/vite';
import { vite as vidstack } from 'vidstack/plugins';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [vidstack(), sveltekit()],
		resolve: {
			alias: [
				{ find: 'path', replacement: 'path-browserify' },
			],
		},
		server: {
			proxy: {
				'/download': {
					target: env.BACKEND_URL,
					changeOrigin: true,
				}
			}
		}
	}
});
