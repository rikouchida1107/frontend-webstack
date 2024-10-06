import { glob } from 'glob';
import path from 'path';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import { templateCompiler } from './template-compiler.mjs';

const DIST_DIR = 'dist/';
const SOURCE_DIR = 'src/';

const plugins = [
  {
    name: 'ejs-compiler',
    version: '1.0.0',
    buildStart: function () {
      const templateDir = SOURCE_DIR + 'templates/';

      const ejsPaths = glob.sync(templateDir + '**/*.ejs', {
        ignore: templateDir + 'includes/**/*.ejs',
      });
      ejsPaths.forEach(ejsPath => {
        templateCompiler(templateDir, DIST_DIR, ejsPath);

        if (process.env.ROLLUP_WATCH) {
          this.addWatchFile(path.resolve('./', ejsPath));
        }
      });
    },
  },
  sass({
    output: DIST_DIR + 'css/style.css',
    options: { outputStyle: 'compressed' },
  }),
];

let watchOptions = false;

if (process.env.ROLLUP_WATCH) {
  watchOptions = {
    // buildDelay: 0,
    chokidar: { usePolling: true },
    clearScreen: false,
    exclude: 'node_modules/**',
    include: SOURCE_DIR + '**/*.*',
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
      file: DIST_DIR + 'js/index.js',
      format: 'esm',
    },
  ],
  watch: watchOptions,
  plugins: plugins,
};
