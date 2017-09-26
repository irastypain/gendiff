import genDiff from '../src/index';

const pathToFixtures = `${__dirname}/__fixtures__`;

test('compare two flat .json files ', () => {
  const expected = '{\n    host: hexlet.io\n  + timeout: 20\n  - timeout: 50\n  - proxy: 123.234.53.22\n  + verbose: true\n}';
  const pathToFstFile = `${pathToFixtures}/json/before.json`;
  const pathToSndFile = `${pathToFixtures}/json/after.json`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expected);
});
