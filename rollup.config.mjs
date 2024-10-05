import { glob } from 'glob';
import path from 'path';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import { templateHandler } from './template-handler.mjs';

let plugins = [
  {
    name: 'ejs-compiler',
    version: '1.0.0',
    buildStart: function () {
      const baseDir = 'src/templates/';
      const distDir = 'dist/';

      const ejsPaths = glob.sync(baseDir + '**/*.ejs', {
        ignore: baseDir + 'includes/**/*.ejs',
      });
      ejsPaths.forEach(ejsPath => {
        templateHandler(baseDir, distDir, ejsPath);

        if (process.env.ROLLUP_WATCH) {
          this.addWatchFile(path.resolve('./', ejsPath));
        }
      });
    },
  },
  sass({
    output: 'dist/css/style.css',
    options: {
      outputStyle: 'compressed',
    },
  }),
];

let watchOptions = false;

if (process.env.ROLLUP_WATCH) {
  watchOptions = {
    // buildDelay: 0,
    chokidar: { usePolling: true },
    clearScreen: false,
    exclude: 'node_modules/**',
    include: 'src/**/*.*',
    // skipWrite: false,
  };

  plugins.push([
    serve({
      open: true,
      contentBase: 'dist',
      port: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache',
      },
      onListening: function (server) {
        const address = server.address();
        const host = address.address === '::' ? 'localhost' : address.address;
        // by using a bound function, we can access options as `this`
        const protocol = this.https ? 'https' : 'http';
        console.log(`Server listening at ${protocol}://${host}:${address.port}/`);
      },
    }),
  ]);
}

export default {
  input: 'main.js',
  context: 'window',
  output: [
    {
      file: 'dist/js/index.js',
      format: 'esm',
    },
  ],
  watch: watchOptions,
  plugins: plugins,
};
