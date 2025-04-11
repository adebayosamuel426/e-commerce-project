import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    esbuild: {
        drop: ['console', 'debugger'],
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5050/api',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});