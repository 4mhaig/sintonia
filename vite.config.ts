import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' para que funcione en GitHub Pages (4mhaig.github.io/sintonia) y en un dominio propio
export default defineConfig({
  plugins: [react()],
  base: './',
})
