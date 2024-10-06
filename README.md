# Frontend web stack

## Get started

```bash
npm install ejs glob rollup
npm install rollup-plugin-sass rollup-plugin-serve

node -v > .node-version

mkdir -p src/{styles,template/includes}
touch src/styles/main.scss
touch src/templates/index.ejs
touch src/templates/_header.ejs

cp -ap THIS_PROJECT/.gitignore .
cp -ap THIS_PROJECT/main.js .
cp -ap THIS_PROJECT/rollup.config.mjs .
cp -ap THIS_PROJECT/template-compiler.mjs .
```

## How to build

```bash
rollup --config
# OR npm run build
```

## How to development

```bash
rollup --config --watch # default port 3000
# npm run watch
```
