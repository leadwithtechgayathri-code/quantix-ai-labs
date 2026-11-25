import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Default build (Vercel): one shell plus one JavaScript bundle per phase, loaded on demand.
// `npm run build:single` makes one self-contained index.html instead (for hosts that take a single file).
export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: mode === 'single' ? [viteSingleFile()] : [],
  build: {
    target: 'es2022',
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    chunkSizeWarningLimit: 900,
  },
}));
