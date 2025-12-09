import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        host: true
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                savor: resolve(__dirname, 'savor/index.html'),
            },
        },
    },
})
