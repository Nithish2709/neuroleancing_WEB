import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
    plugins: [react()],

    // Dev proxy — only active during `vite dev`, not in production build
    server: command === 'serve' ? {
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            }
        }
    } : {},

    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'three':        ['three'],
                    'r3f':          ['@react-three/fiber', '@react-three/drei'],
                    'framer':       ['framer-motion'],
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                }
            }
        }
    },

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/tests/setup.js',
        css: false
    }
}))
