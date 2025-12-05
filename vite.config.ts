import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Use environment variable or default to production
  const API_URL = env.VITE_API_URL || 'https://admin.sahara2797.com';

  return {
    plugins: [react()],
    server: {
      port: 3003,
      cors: true,
      proxy: {
        '/api/v1': {
          target: API_URL,
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
              const targetUrl = `${API_URL}${proxyReq.path}`;
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
          target: API_URL,
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
  };
});
