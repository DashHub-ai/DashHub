import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/admin/' : '/',
  server: {
    host: true,
    port: 5174,
  },
  envPrefix: ['VITE_', 'PUBLIC_VITE_'],
  plugins: [
    react(),
    tsconfigPaths(),
  ],
}));
