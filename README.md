# esbuild-postcss

[![npm version][package-version-badge]][package-version]
[![Node.js CI](https://github.com/karolis-sh/esbuild-postcss/actions/workflows/node.js.yml/badge.svg)](https://github.com/karolis-sh/esbuild-postcss/actions/workflows/node.js.yml)
[![License: MIT](https://img.shields.io/badge/license-mit-yellow.svg)](https://opensource.org/licenses/MIT)

Seamless integration between [esbuild](https://esbuild.github.io/)
and [PostCSS](https://github.com/postcss/postcss).

## Installation

```bash
npm i postcss esbuild-postcss -D
```

or

```bash
yarn add postcss esbuild-postcss --dev
```

## Usage

```js
const esbuild = require('esbuild');
const postcss = require('esbuild-postcss');

esbuild
  .build({
    entryPoints: ['style.css'],
    bundle: true,
    outdir: 'build',
    plugins: [postcss()],
  })
  .catch(() => process.exit(1));
```

## Options

### extensions

Type: `string[]`<br>
Default: `['.css']`

This plugin will process files ending with these extensions.

## Licence

[MIT](/LICENSE)

[package-version-badge]: https://badge.fury.io/js/esbuild-postcss.svg
[package-version]: https://www.npmjs.com/package/esbuild-postcss
