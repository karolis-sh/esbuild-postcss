const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const process = require('process');

const { build } = require('esbuild');

const postcss = require('../lib');

const bundle = async (entry, options, silent) => {
  const inputFilename = path.join(__dirname, entry);
  const outputDir = path.join(
    os.tmpdir(),
    'esbuild-postcss',
    entry,
    Date.now().toString(),
  );
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
    logLevel: silent ? 'silent' : undefined,
  });
  spy.mockClear();

  return fs.readFile(
    path.join(outputDir, `${path.basename(entry, path.extname(entry))}.css`),
    'utf-8',
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

it('should handle invalid config', async () => {
  try {
    await bundle('fixtures/invalid-config/index.css', {}, true);
    expect(true).toBeFalsy();
  } catch (err) {
    // eslint-disable-next-line jest/no-conditional-expect
    expect(/Loading PostCSS Parser failed/i.test(err.message)).toBeTruthy();
  }
});

it('should handle PostCSS options', async () => {
  const output = await bundle('fixtures/postcss-options/index.sss', {
    extensions: ['.sss'],
  });
  expect(output).toMatchSnapshot();
});
