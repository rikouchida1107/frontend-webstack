import ejs from 'ejs';
import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import sass from 'rollup-plugin-sass';
import serve from 'rollup-plugin-serve';

let plugins = [
  {
    name: 'ejs-compiler',
    async buildStart () {
      const baseDir = 'src/templates/';
      const distDir = 'dist/';

      const ejsPaths = await glob(baseDir + '**/*.ejs', {
        ignore: baseDir + 'includes/**/*.ejs'
      });
      ejsPaths.forEach(ejsPath => {
        const template = fs.readFileSync(ejsPath, 'UTF-8');
        const compiled = ejs.compile(template, { filename: ejsPath });

        const distPath = distDir + path.relative(baseDir, ejsPath).replaceAll('.ejs', '.html');
        if (! fs.existsSync(path.dirname(distPath))) {
          fs.mkdirSync(path.dirname(distPath), { recursive: true });
        }

        fs.writeFileSync(distPath, compiled());
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
    include: 'src/**',
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
        const address = server.address()
        const host = address.address === '::' ? 'localhost' : address.address
        // by using a bound function, we can access options as `this`
        const protocol = this.https ? 'https' : 'http'
        console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
      }
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
