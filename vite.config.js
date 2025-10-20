import { defineConfig } from 'vite';
import { ripple } from 'vite-plugin-ripple';

export default defineConfig({
	plugins: [ripple()],
	server: {
		port: 4000,
	},
	build: {
		target: 'esnext',
	},
});
