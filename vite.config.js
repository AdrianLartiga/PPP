import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    fs: {
      // 👇 Permite a Vite servir archivos estáticos desde node_modules (necesario para las fuentes de PrimeIcons)
      allow: ['..', 'node_modules']
    }
  }
})
