import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Only these top-level entries ever need live-reload: everything the app actually imports
// or serves. Root-level working folders (PRODUCTOS, METODOS PAGO, assets, etc.) hold large
// binaries that are sometimes locked by other apps (OneDrive, image viewers...) and crash
// Vite's watcher with EBUSY — so instead of chasing each one individually, only these are watched.
const WATCHED_ROOT_ENTRIES = new Set(['src', 'public']);
const WATCHED_ROOT_FILES = new Set([
  'vite.config.ts',
  'tsconfig.json',
  'package.json',
  'package-lock.json',
  'index.html',
]);

export default defineConfig(() => {
  const root = path.resolve(__dirname, '.');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': root,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: (filePath) => {
          const rel = path.relative(root, filePath);
          if (!rel || rel.startsWith('..')) return false;
          const top = rel.split(path.sep)[0];
          if (WATCHED_ROOT_ENTRIES.has(top)) return false;
          if (WATCHED_ROOT_FILES.has(rel)) return false;
          return true;
        },
      },
    },
  };
});
