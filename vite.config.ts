import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables (API_KEY from Vercel)
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Pass API_KEY to the app safely
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})