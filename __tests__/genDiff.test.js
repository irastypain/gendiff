import genDiff from '../src/lib/genDiff';

test('compare two flat .json files ', () => {
  const expected = '{\n    host: hexlet.io\n  + timeout: 20\n  - timeout: 50\n  - proxy: 123.234.53.22\n  + verbose: true\n}';
  const pathToFstFile = `${__dirname}/json/before.json`;
  const pathToSndFile = `${__dirname}/json/after.json`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expected);
});
