import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import ViteProxyServer from './viteUtil/viteProxyServer/vite-plugin-proxy-server';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { VueHooksPlusResolver } from '@vue-hooks-plus/resolvers';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import vue from '@vitejs/plugin-vue';
import VitePluginVueDevtools from 'vite-plugin-vue-devtools';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
const OpenSSl = (process.env?.npm_lifecycle_event === 'dev-ssl');

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 4008,
    host: OpenSSl,
    https: OpenSSl && {
      key: fs.readFileSync('viteUtil/cert/key.pem'),
      cert: fs.readFileSync('viteUtil/cert/cert.pem')
    }
    // headers: {
    //   'Cross-Origin-Opener-Policy': 'same-origin',
    //   'Cross-Origin-Embedder-Policy': 'require-corp'
    // }
  },
  plugins: [
    VitePluginVueDevtools(),
    vue(),
    AutoImport({
      imports: ['vue'],
      resolvers: [
        ElementPlusResolver(),
        VueHooksPlusResolver(),
        // Auto import icon components
        IconsResolver({
          prefix: 'Icon'
        })
      ],
      eslintrc: { // Generate eslint config file, needs to be imported in eslint config
        enabled: true, // Default `false`
        globalsPropValue: 'readonly' // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      }
    }),
    Components({
      resolvers: [
        // Auto register icon components
        IconsResolver({
          enabledCollections: ['ep']
        }),
        // Auto import Element Plus components
        ElementPlusResolver()
      ]
    }),
    Icons({
      autoInstall: true
    }),
    // Local proxy service
    ViteProxyServer()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      pages: path.resolve(__dirname, './src/pages')
    }
  },
  build: {
    sourcemap: true
  }
});
