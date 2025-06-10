import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import path from 'path'; // Import path for alias resolution

export default defineConfig({
  plugins: [
    tailwindcss({
      theme: {
        fontFamily: {
          sans: [
            'Montserrat',
            'system-ui',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Helvetica Neue',
            'Arial',
            'Noto Sans',
            'sans-serif',
          ],
        },
      },
    }),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'app'), // or 'src' if that’s your main directory
    },
  },
  build: {
    // rollupOptions: {
    //   external: [
    //     '~/components/icons',
    //     '~/components/checkbox',
    //     '~/lib/const',
    //     '~/lib/cn',
    //     '~/lib/filter',
    //   ],
    // },
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: [
        'react-microsoft-clarity',
        'react-lazy-load-image-component',
        'prop-types',
        'matchmediaquery',
      ],
    },
  },
});
