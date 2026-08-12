import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { paraglideUrlPatterns } from './src/lib/i18n/routingConfig.js';

export default defineConfig({
	plugins: [
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/paraglide',
			strategy: ['url', 'cookie', 'globalVariable', 'baseLocale'],
			urlPatterns: paraglideUrlPatterns
		}),
		tailwindcss(),
		sveltekit()
	],
	worker: {
		format: 'es'
	},
	optimizeDeps: {
		// Pre-bundling relocates the emscripten JS to .vite/deps, where its
		// locateFile lookup for the sibling sqlite3.wasm 404s. Keep it in its own
		// package folder so the wasm resolves in dev.
		exclude: ['@sqlite.org/sqlite-wasm']
	},
	server: {
		// tauri.conf.json devUrl points here; fail loudly rather than drifting to
		// another port and leaving the desktop webview on a dead URL.
		port: 5173,
		strictPort: true,
		// The Oodle (ooz) wasm module lives in ui/vendor, outside Vite's default dev
		// fs sandbox; allow it so the web worker can load ooz.mjs/ooz.wasm in dev.
		fs: {
			allow: [fileURLToPath(new URL('./vendor', import.meta.url))]
		},
		proxy: {
			'/api': {
				target: 'http://localhost:5174',
				changeOrigin: true
			}
		}
	},
	ssr: {
		// Skeleton's Zag packages intentionally contain mixed pinned versions.
		// Bundle them for SSR so each package resolves its own compatible core
		// instead of externalizing every import to the root 1.3.1 install.
		noExternal: [/^@skeletonlabs\//, /^@zag-js\//]
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.test.mjs', '../scripts/**/*.test.mjs']
	}
});
