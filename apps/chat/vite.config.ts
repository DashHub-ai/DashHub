import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/app/' : '/',
  server: {
    host: true,
    port: 5173,
  },
  envPrefix: ['VITE_', 'PUBLIC_VITE_'],
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  ...mode !== 'production' && {
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
}));
