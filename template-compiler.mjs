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
      fs.writeFileSync(
        distPath.replace(path.basename(distPath), page.slug),
        compiler(page.data)
      );
    });

    return;
  }

  let data = {};
  if (ejsPath in templateContexts && 'data' in templateContexts[ejsPath]) {
    data = templateContexts[ejsPath].data;
  }

  fs.writeFileSync(distPath, compiler(data));
}

export {
  templateCompiler,
};
