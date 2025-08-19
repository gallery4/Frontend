import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { vite as vidstack } from 'vidstack/plugins';
import { defineConfig, loadEnv } from 'vite';
import { SvelteKitPWA} from '@vite-pwa/sveltekit'

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [tailwindcss(), vidstack(), sveltekit(), SvelteKitPWA(
			{
				srcDir: './src',
				mode: 'development',
				// you don't need to do this if you're using generateSW strategy in your app
				//strategies: generateSW ? 'generateSW' : 'injectManifest',

				// you don't need to do this if you're using generateSW strategy in your app
				//filename: generateSW ? undefined : 'prompt-sw.ts',
				scope: '/',
				base: '/',
				selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
				pwaAssets: {
					config: true,
				},
				manifest: {
					short_name: 'Gallery 4',
					name: 'Gallery 4',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					theme_color: '#ffffff',
					background_color: '#000000',
				},
				injectManifest: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				},
				workbox: {
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
				},
				devOptions: {
					enabled: false,
					suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
					type: 'module',
					navigateFallback: '/',
				},
				// if you have shared info in svelte config file put in a separate module and use it also here
				kit: {
					includeVersionFile: true,
				},
			}
		), devtoolsJson()],
		resolve: {
			alias: [{ find: 'path', replacement: 'path-browserify' }]
		},
	};
});
