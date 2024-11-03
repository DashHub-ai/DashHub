import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/admin/' : '/',
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    react(),
    tsconfigPaths(),
  ],
}));
