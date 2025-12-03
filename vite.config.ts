import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    cors: true,
    proxy: {
      '/api/v1': {
        target: 'https://admin.sahara2797.com', // Production Backend
        changeOrigin: true,
        secure: true,
        ws: true,
        // Proxy /api/v1 requests directly to backend (no rewrite needed)
        configure: (proxy, _options) => {
          proxy.on('error', (err, req, _res) => {
            console.error('❌ Proxy Error:', err.message);
            console.error('Request URL:', req.url);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const targetUrl = `https://admin.sahara2797.com${proxyReq.path}`;
            console.log(`➡️  ${req.method} ${req.url} → ${targetUrl}`);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            const status = proxyRes.statusCode;
            const statusIcon = status >= 200 && status < 300 ? '✅' : status === 404 ? '❌' : '⚠️';
            console.log(`${statusIcon}  ${status} ${req.method} ${req.url}`);
          });
        },
      },
      '/uploads': {
        target: 'https://admin.sahara2797.com',
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});

