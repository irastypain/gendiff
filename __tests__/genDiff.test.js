import genDiff from '../src/index';

const pathToFixtures = `${__dirname}/__fixtures__`;
const expectedFlat = '{\n    host: hexlet.io\n  + timeout: 20\n  - timeout: 50\n  - proxy: 123.234.53.22\n  + verbose: true\n}';

test('compare two flat .json files', () => {
  const pathToFstFile = `${pathToFixtures}/json/before.json`;
  const pathToSndFile = `${pathToFixtures}/json/after.json`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expectedFlat);
});

test('compare two flat .yaml files', () => {
  const pathToFstFile = `${pathToFixtures}/yaml/before.yaml`;
  const pathToSndFile = `${pathToFixtures}/yaml/after.yaml`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expectedFlat);
});

test('compare two flat .ini files', () => {
  const pathToFstFile = `${pathToFixtures}/ini/before.ini`;
  const pathToSndFile = `${pathToFixtures}/ini/after.ini`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expectedFlat);
});
