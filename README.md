# Frontend web stack

## Get started

**minimum**

```bash
npm install ejs glob rollup
npm install rollup-plugin-sass rollup-plugin-serve

node -v > .node-version

mkdir -p dist/{assets,css,js}
mkdir -p src/{modules,styles,template/includes}
touch src/modules/index.js
touch src/styles/main.scss
touch src/templates/index.ejs
touch src/templates/_header.ejs

cp -ap THIS_PROJECT/.gitignore .
cp -ap THIS_PROJECT/main.js .
cp -ap THIS_PROJECT/rollup.config.mjs .
cp -ap THIS_PROJECT/template-compiler.mjs .
cp -ap THIS_PROJECT/template-contexts.mjs .
cp -ap THIS_PROJECT/template-global.mjs .
```

* 静的ファイルは `dist/assets/` 配下に格納
* `dist/css/style.css` はビルド後にファイルが生成される
* `dist/js/index.js` はビルド後にファイルが生成される

## How to build

```bash
rollup --config
# OR npm run build
```

## How to build with ENV

```bash
touch env.xxx.mjs
ENV=xxx rollup --config
```

`env.xxx.mjs`
```:js
const vars = {
  someKey: 'SomeValue',
};

export {
  vars,
}
```

`some.ejs`
```ejs
<%= envVars.someKey %>
```

## How to development

```bash
rollup --config --watch
# npm run watch
```

* `dist/` に出力は行いません。
* `node_modules/.frontend-webstack/` に一時ファイルを出力します。
