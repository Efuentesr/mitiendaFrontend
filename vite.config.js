import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',       // 🔹 Permite acceso desde fuera del contenedor
    watch: {
      usePolling: true,    // 🔹 Forza a Vite a escanear cambios
      interval: 100        // 🔹 Reduce latencia de refresco
    },
    hmr: {
      clientPort: 5173     // 🔹 Importante si estás en Windows/WSL o Docker Desktop
    }
  }
})
