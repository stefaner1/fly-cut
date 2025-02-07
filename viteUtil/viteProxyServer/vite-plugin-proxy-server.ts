import type { Plugin } from 'vite';
const glob = require('glob');
const fs = require('fs');
const vm = require('node:vm');
const url = require('url');
const context = { // Code execution context
  url,
  handler: () => {
    console.warn('Servers module import error');
  }
};
vm.createContext(context);

function ViteProxyServer(): Plugin {
  return {
    name: 'vite:proxy-server',
    // Called after parsing Vite configuration.
    configResolved(config) {},
    // Hook for configuring development server
    configureServer(server) {
      // Add COOP, COEP response headers to support wasm data isolation
      server.middlewares.use((req, res, next) => {
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
        next();
      });

      // Register files under servers directory to API endpoints
      const files = glob.sync('viteUtil/viteProxyServer/servers/**/*.js');
      console.log('****Registering API endpoints****');
      files.map((filePath: string) => {
        let urlPath = (filePath.match(/(?<=servers).*(?=\.js)/) || [])[0];
        urlPath = urlPath.replace(/[\\/]+/g, '/');
        vm.runInContext(fs.readFileSync(filePath, 'utf-8'), context)
        console.log('****Registering API endpoint: ' + urlPath);
        server.middlewares.use(urlPath, context.handler);
      })
    }
  };
}

export default ViteProxyServer;
