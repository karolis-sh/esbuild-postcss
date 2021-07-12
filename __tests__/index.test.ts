import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { build } from 'esbuild';

import postcss from '../src';
import { Options } from '../src/interface';

const process = require('process');

const bundle = async (entry: string, options?: Options): Promise<string> => {
  const inputFilename = path.join(__dirname, entry);
  const outputDir = path.join(os.tmpdir(), 'esbuild-postcss', entry, Date.now().toString());
  const cwd = path.dirname(inputFilename);

  const spy = jest.spyOn(process, 'cwd');
  spy.mockReturnValue(cwd);
  await build({
    entryPoints: [inputFilename],
    outdir: outputDir,
    outbase: cwd,
    bundle: true,
    plugins: [postcss(options)],
    sourcemap: true,
  });
  spy.mockClear();

  return fs.readFile(
    path.join(outputDir, `${path.basename(entry, path.extname(entry))}.css`),
    'utf-8'
  );
};

it('should handle css file entry', async () => {
  const output = await bundle('fixtures/config-file/index.css');
  expect(output).toMatchSnapshot();
});

it('should handle css imports', async () => {
  const output = await bundle('fixtures/config-file/index.js');
  expect(output).toMatchSnapshot();
});

it('should handle child css import', async () => {
  const output = await bundle('fixtures/config-file/import.css');
  expect(output).toMatchSnapshot();
});

it('should handle child css import url', async () => {
  const output = await bundle('fixtures/config-file/import-url.css');
  expect(output).toMatchSnapshot();
});

it('should handle postcss-import style inlining plugin', async () => {
  const output = await bundle('fixtures/postcss-import/index.css');
  expect(output).toMatchSnapshot();
});

it('should handle postcss-import style inlining plugin via import url', async () => {
  const output = await bundle('fixtures/postcss-import/index-import-url.css');
  expect(output).toMatchSnapshot();
});

it('should handle no config file', async () => {
  const output = await bundle('fixtures/no-config-file/index.css');
  expect(output).toMatchSnapshot();
});

it('should use extensions option', async () => {
  const output = await bundle('fixtures/config-file/index.pcss', {
    extensions: ['.css', '.pcss'],
  });
  expect(output).toMatchSnapshot();
});

it('should use extensions option with no config', async () => {
  const output = await bundle('fixtures/no-config-file/index.pcss', {
    extensions: ['.css', '.pcss'],
  });
  expect(output).toMatchSnapshot();
});
