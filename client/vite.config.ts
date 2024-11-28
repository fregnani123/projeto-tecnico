import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 80, 
    open: true, 
    proxy: {
      '/api': 'http://server:8080', 
    },
  },
});

