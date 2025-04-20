import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    // https: {
    //   key: fs.readFileSync('./path/to/your/private.key'), // Path to your private key
    //   cert: fs.readFileSync('./path/to/your/certificate.crt'), // Path to your certificate
    // },
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Backend on port 3000
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
