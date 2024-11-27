import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 80, // A porta na qual o cliente será servido
    open: true, // Abrir o navegador automaticamente
    proxy: {
      '/api': 'http://server:8080', // Redireciona requisições para /api para o servidor
    },
  },
});

