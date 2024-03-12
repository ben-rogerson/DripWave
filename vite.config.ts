import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import million from 'million/compiler'

export default defineConfig({
  plugins: [million.vite({ auto: true }), react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
