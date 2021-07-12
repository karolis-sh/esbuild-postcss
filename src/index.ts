import path from 'path';
import fs from 'fs/promises';
import { Plugin } from 'esbuild';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';

import { Options } from './interface';

type PostcssOptions = Partial<postcssrc.Result>;

export = ({ extensions = ['.css'] }: Options = {}): Plugin => ({
  name: 'postcss',
  async setup(build) {
    let postcssOptions: PostcssOptions | false;

    try {
      postcssOptions = await postcssrc();
    } catch (err) {
      postcssOptions = false;
    }

    build.onLoad({ filter: new RegExp(`(${extensions.join('|')})$`) }, async (args) => {
      if (postcssOptions) {
        const css = await fs.readFile(args.path, 'utf8');

        const result = await postcss(postcssOptions.plugins).process(css, {
          ...postcssOptions.options,
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
