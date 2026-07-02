import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: '/heart/',
    plugins: [react(), tailwindcss(), viteSingleFile()],
    // Do NOT embed secret keys into the client bundle. Read secrets server-side
    // and proxy API calls from the client to your backend (example below).
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 100000000,
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // Example proxy: forward client requests starting with /api to a backend
      // that holds your secret (run your backend on localhost:3001 or adjust).
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
