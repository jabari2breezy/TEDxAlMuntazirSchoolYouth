import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    base: './',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      // Raise the warning threshold — we're already splitting below
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            // React core — cached separately, rarely changes
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            // Animation library — largest dependency
            'vendor-motion': ['motion/react'],
            // 3D / WebGL (Three.js + R3F) — only needed on Home hero desktop
            'vendor-3d': ['three', '@react-three/fiber', '@react-three/drei'],
            // UI icons
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  };
});
