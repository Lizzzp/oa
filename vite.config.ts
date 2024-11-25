import { getPluginsList } from './build/plugins';
import { include, exclude } from './build/optimize';
import { type UserConfigExport, type ConfigEnv, loadEnv } from 'vite';
import {
  root,
  alias,
  wrapperEnv,
  pathResolve,
  __APP_INFO__
} from './build/utils';

export default ({ mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH } =
    wrapperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      // 端口号
      port: VITE_PORT,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://192.168.10.58:8055',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        '/db': {
          target: 'http://192.168.10.139:8056',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/db/, '')
        },
      },
      warmup: {
        clientFiles: ['./index.html', './src/{views,components}/*']
      }
    },
    plugins: getPluginsList(VITE_CDN, VITE_COMPRESSION),
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      target: 'es2015',
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve('./index.html', import.meta.url)
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        }
      }
    },
    define: {
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
