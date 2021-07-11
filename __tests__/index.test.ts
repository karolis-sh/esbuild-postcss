import path from 'path';
import os from 'os';
import fs from 'fs/promises';
import { build } from 'esbuild';

import postcss from '../src';

const process = require('process');

const transform = async (entry: string, outFile: string): Promise<string> => {
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
    plugins: [postcss()],
  });
  spy.mockClear();

  return fs.readFile(path.join(outputDir, outFile), 'utf-8');
};

it('should handle css file entry', async () => {
  const output = await transform('fixtures/config-file/index.css', 'index.css');
  expect(output).toMatchSnapshot();
});

it('should handle css imports', async () => {
  const output = await transform('fixtures/config-file/index.js', 'index.css');
  expect(output).toMatchSnapshot();
});
