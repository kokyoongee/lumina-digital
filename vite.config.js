import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    appType: 'mpa',
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
