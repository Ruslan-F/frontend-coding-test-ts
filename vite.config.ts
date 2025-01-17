import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  test: {
    // enable jest-like global test APIs
    globals: true,
    // simulate DOM with happy-dom
    // (requires installing happy-dom as a peer dependency)
    environment: 'happy-dom',
  },

  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
      {
        find: '@assets',
        replacement: fileURLToPath(
          new URL('./src/shared/assets', import.meta.url),
        ),
      },
      {
        find: '@cmp',
        replacement: fileURLToPath(
          new URL('./src/shared/cmp', import.meta.url),
        ),
      },
      {
        find: '@stores',
        replacement: fileURLToPath(
          new URL('./src/shared/stores', import.meta.url),
        ),
      },
      {
        find: '@use',
        replacement: fileURLToPath(
          new URL('./src/shared/use', import.meta.url),
        ),
      },
    ],
  },
})
