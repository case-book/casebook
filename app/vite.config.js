import {defineConfig} from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from 'path';

// https://vitejs-kr.github.io/config/server-options.html#server-port
export default defineConfig({
    build: {
        outDir: 'build'
    },
    plugins: [ basicSsl(), reactRefresh()],
    server : {
        port : 3000,
        https : true
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "@/styles/variables.scss";`
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        }
    },
})
