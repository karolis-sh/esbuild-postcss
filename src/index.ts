import fs from 'fs/promises';
import { Plugin } from 'esbuild';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';

type PostcssOptions = Partial<postcssrc.Result>;

export = (): Plugin => ({
  name: 'postcss',
  async setup(build) {
    let postcssConfig: PostcssOptions | false;

    try {
      postcssConfig = await postcssrc();
    } catch (err) {
      postcssConfig = false;
    }

    build.onLoad({ filter: /\.css$/ }, async (args) => {
      if (postcssConfig) {
        const css = await fs.readFile(args.path, 'utf8');

        const result = await postcss(postcssConfig.plugins).process(css, {
          ...postcssConfig.options,
          from: args.path,
        });

        return {
          contents: result.css,
          loader: 'css',
        };
      }

      return { loader: 'css' };
    });
  },
});
