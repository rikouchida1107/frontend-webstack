import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { templateContexts } from './template-contexts.mjs';

function templateCompiler (
  /** @type {string} */ templateDir,
  /** @type {string} */ distDir,
  /** @type {string} */ ejsPath,
) {
  const template = fs.readFileSync(ejsPath, { encoding: 'utf-8' });
  const compiler = ejs.compile(template, { filename: ejsPath });

  const distPath = distDir + path.relative(templateDir, ejsPath).replaceAll('.ejs', '.html');
  if (! fs.existsSync(path.dirname(distPath))) {
    fs.mkdirSync(path.dirname(distPath), { recursive: true });
  }

  if (ejsPath in templateContexts && 'pages' in templateContexts[ejsPath]) {
    const pages = templateContexts[ejsPath].pages;
    pages.forEach(page => {
      const pagePath = distPath.replace(path.basename(distPath), page.slug);
      fs.writeFileSync(
        pagePath,
        compiler(page.data)
      );
      info('created ' + pagePath);
    });

    return;
  }

  let data = {};
  if (ejsPath in templateContexts && 'data' in templateContexts[ejsPath]) {
    data = templateContexts[ejsPath].data;
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
