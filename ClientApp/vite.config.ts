import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { readFileSync } from 'fs'
import { join } from 'path';

const baseFolder =
  process.env.APPDATA !== undefined && process.env.APPDATA !== ''
    ? `${process.env.APPDATA}/ASP.NET/https`
    : `${process.env.HOME}/.aspnet/https`;

const certificateName = process.env.npm_package_name

const certFilePath = join(baseFolder, `${certificateName}.pem`);
const keyFilePath = join(baseFolder, `${certificateName}.key`);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: {
      key: readFileSync(keyFilePath),
      cert: readFileSync(certFilePath)
    },
    port: 5002,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://localhost:5001/',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
