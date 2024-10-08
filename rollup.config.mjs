import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';
import { templateCompiler } from './template-compiler.mjs';
import { globalVars } from './template-global.mjs';

const DIST_DIR = 'dist/';
const TMP_DIST_DIR = 'node_modules/.frontend-webstack/';
const OUTPUT_DIR = process.env.ROLLUP_WATCH ? TMP_DIST_DIR : DIST_DIR;
const SOURCE_DIR = 'src/';
const ASSETS_ROOT = 'assets/';

const plugins = [
  {
    name: 'ejs-compiler',
    version: '1.0.0',
    buildStart: async function () {
      let envVars = {};
      if (process.env.ENV !== undefined) {
        const { vars } = await import('./env.' + process.env.ENV + '.mjs');
        envVars = vars;
      }

      const templateDir = SOURCE_DIR + 'templates/';

      const ejsPaths = glob.sync(templateDir + '**/*.ejs', {
        ignore: templateDir + 'includes/**/*.ejs',
      });
      ejsPaths.forEach((ejsPath) => {
        templateCompiler(envVars, globalVars, templateDir, OUTPUT_DIR, ejsPath);

        if (process.env.ROLLUP_WATCH) {
          this.addWatchFile(path.resolve('./', ejsPath));
        }
      });
    },
  },
  sass({
    output: OUTPUT_DIR + 'css/style.css',
    options: {
      outputStyle: 'compressed',
      silenceDeprecations: ['legacy-js-api'],
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
    include: SOURCE_DIR + '**/*.*',
    // skipWrite: false,
  };

  plugins.push([
    serve({
      open: true,
      contentBase: OUTPUT_DIR,
      port: process.env.PORT ?? 3000,
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

  if (! fs.existsSync(TMP_DIST_DIR)) {
    fs.mkdirSync(TMP_DIST_DIR, { recursive: true });
    fs.symlinkSync(path.resolve(DIST_DIR + ASSETS_ROOT), path.resolve(TMP_DIST_DIR + ASSETS_ROOT), 'dir');
  }
}

export default {
  input: 'main.js',
  context: 'window',
  output: [
    {
      file: OUTPUT_DIR + 'js/index.js',
      format: 'esm',
    },
  ],
  watch: watchOptions,
  plugins: plugins,
};
