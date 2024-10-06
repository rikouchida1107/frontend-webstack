import fs from 'fs';
import ejs from 'ejs';
import path from 'path';

const contexts = {
  'src/templates/news/index.ejs': {
    data: {
      entries: [
        { id: 1, title: 'HELLO :)' },
        { id: 2, title: 'HELLO :-D' },
      ],
    },
  },
  'src/templates/news/detail.ejs': {
    pages: [
      {
        slug: '1.html', data: {
          id: 1, title: 'HELLO :)',
        },
      },
      {
        slug: '2.html', data: {
          id: 2, title: 'HELLO :-D',
        },
      },
    ],
  },
};

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

  if (ejsPath in contexts && 'pages' in contexts[ejsPath]) {
    const pages = contexts[ejsPath].pages;
    pages.forEach(page => {
      fs.writeFileSync(
        distPath.replace(path.basename(distPath), page.slug),
        compiler(page.data)
      );
    });

    return;
  }

  let data = {};
  if (ejsPath in contexts && 'data' in contexts[ejsPath]) {
    data = contexts[ejsPath].data;
  }

  fs.writeFileSync(distPath, compiler(data));
}

export {
  templateCompiler,
};
