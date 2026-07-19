import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Shree Laxmi Inn - Ayodhya Guesthouse & Darshan Guide',
        short_name: 'Shree Laxmi Inn',
        description:
          'Digital guest companion for Shree Laxmi Inn, Ayodhya: temple darshan guide, aarti timings, darshan routes and guesthouse information.',
        theme_color: '#1E2749',
        background_color: '#FBF3E7',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        lang: 'en',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Serve the last cached response first for instant loads on the
        // low-signal connections common at pilgrimage sites, then refresh
        // in the background.
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: true,
    // Some component tests type long strings across several form fields;
    // the 5s default can be tight on slower machines or CI runners, so a
    // generous global timeout avoids flaky, environment-dependent failures.
    testTimeout: 15000,
    hookTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'node_modules/**',
        'src/main.jsx',
        'src/App.jsx',
        'src/firebase/**',
        'src/test/**',
        '**/__tests__/**',
        '**/*.test.{js,jsx}',
        '**/*.config.js',
      ],
    },
  },
});
