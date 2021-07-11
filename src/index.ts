import fs from 'fs/promises';
import { Plugin } from 'esbuild';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';

export = (): Plugin => ({
  name: 'postcss',
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, async (args) => {
      const css = await fs.readFile(args.path, 'utf8');

      const result = await postcssrc().then(({ plugins, options }) =>
        postcss(plugins).process(css, { ...options, from: args.path })
      );

      return {
        contents: result.css,
        loader: 'css',
      };
    });
  },
});
