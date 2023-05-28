import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      "~rest": path.resolve(__dirname, './src/rest'),
      "~requests": path.resolve(__dirname, './src/requests'),
      "~auth": path.resolve(__dirname, './src/Auth'),
      "~map": path.resolve(__dirname, './src/Map'),
      "~store": path.resolve(__dirname, './src/store'),
      "~components": path.resolve(__dirname, './src/components'),
      "~routes": path.resolve(__dirname, './src/routes'),
    }
  }
});