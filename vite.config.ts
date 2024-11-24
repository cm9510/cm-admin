import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  css:{
    preprocessorOptions:{
      less:{
        
      }
    }
  },
  define:{
    'process.env':{}
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server:{
    proxy: {
      '^/a/': {
        target: 'http://192.168.1.103:8081',
        changeOrigin: true
      }
    }
  }
})
