import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { envVars, globalVars, templateContexts } from './template-contexts.mjs';

function templateCompiler (
  /** @type {string} */ templateDir,
  /** @type {string} */ distDir,
  /** @type {string} */ ejsPath,
) {
  const env = process.env.ENV === undefined ? {} : (envVars[process.env.ENV] ?? {});

  const template = fs.readFileSync(ejsPath, { encoding: 'utf-8' });
  const compiler = ejs.compile(template, { filename: ejsPath, root: templateDir });

  const distPath = distDir + path.relative(templateDir, ejsPath).replaceAll('.ejs', '.html');
  if (! fs.existsSync(path.dirname(distPath))) {
    fs.mkdirSync(path.dirname(distPath), { recursive: true });
  }

  let data = Object.assign({ envVars: env }, { vars: globalVars });

  if (ejsPath in templateContexts && 'pages' in templateContexts[ejsPath]) {
    const pages = templateContexts[ejsPath].pages;
    pages.forEach(page => {
      const pagePath = distPath.replace(path.basename(distPath), page.slug);
      fs.writeFileSync(
        pagePath,
        compiler(Object.assign(data, page.data)),
      );
      info('created ' + pagePath);
    });

    return;
  }

  if (ejsPath in templateContexts && 'data' in templateContexts[ejsPath]) {
    data = Object.assign(data, templateContexts[ejsPath].data);
  }

  fs.writeFileSync(distPath, compiler(data));
  info('created ' + distPath);
}

function info (/** @type {string} */ message) {
  const magenta = '\u001b[36m';
  const bold = '\u001b[1m';
  const reset = '\u001b[0m';
  console.info(magenta + bold + message + reset);
}

export {
  templateCompiler,
};
