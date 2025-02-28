import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 7008,
    host: true, // To make it accessible from outside (e.g., PM2)
  },
});
