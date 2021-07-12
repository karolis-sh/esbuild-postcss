import path from 'path';
import fs from 'fs/promises';
import { Plugin } from 'esbuild';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';

import { Options } from './interface';

export = ({ extensions = ['.css'] }: Options = {}): Plugin => ({
  name: 'postcss',
  async setup(build) {
    let postcssConfig: postcssrc.Result | false;

    try {
      postcssConfig = await postcssrc();
    } catch (err) {
      if (/No PostCSS Config found/i.test(err.message)) {
        postcssConfig = false;
      } else {
        throw err;
      }
    }

    build.onLoad({ filter: new RegExp(`(${extensions.join('|')})$`) }, async (args) => {
      if (postcssConfig) {
        const css = await fs.readFile(args.path, 'utf8');

        const result = await postcss(postcssConfig.plugins).process(css, {
          ...postcssConfig.options,
          from: args.path,
        });

        return { contents: result.css, loader: 'css' };
      }

      if (path.extname(args.path) !== '.css') {
        const css = await fs.readFile(args.path, 'utf8');
        return { contents: css, loader: 'css' };
      }

      return { loader: 'css' };
    });
  },
});
