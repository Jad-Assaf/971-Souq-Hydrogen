import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import React from 'react';

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    // Temporarily remove tsconfigPaths to check if it conflicts
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'), // or 'src' if that’s your main directory
    },
  },
  build: {
    rollupOptions: {
      external: [
        // Explicitly list only required external packages, if any
      ],
    },
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      include: [],
    },
  },
});
