import fs from 'fs';
import genDiff from '../src/index';

const pathToFixtures = `${__dirname}/__fixtures__`;
const getPath = (filename, ext) => `${pathToFixtures}/${ext}/${filename}.${ext}`;
const getExpected = filename => fs.readFileSync(`${pathToFixtures}/${filename}`, 'utf-8');

describe('compare two flat files', () => {
  let expected;
  beforeAll(() => {
    expected = getExpected('diffFlat.txt');
  });

  test('.json', () => {
    expect(genDiff(getPath('before', 'json'), getPath('after', 'json'))).toBe(expected);
  });
  test('.yaml', () => {
    expect(genDiff(getPath('before', 'yaml'), getPath('after', 'yaml'))).toBe(expected);
  });
  test('.ini', () => {
    expect(genDiff(getPath('before', 'ini'), getPath('after', 'ini'))).toBe(expected);
  });
});

describe('compare two recursive files', () => {
  let expected;
  beforeAll(() => {
    expected = getExpected('diffRecursive.txt');
  });

  test('.json', () => {
    expect(genDiff(getPath('beforeRecursive', 'json'), getPath('afterRecursive', 'json'))).toBe(expected);
  });
  test('.yaml', () => {
    expect(genDiff(getPath('beforeRecursive', 'yaml'), getPath('afterRecursive', 'yaml'))).toBe(expected);
  });
  test('.ini', () => {
    expect(genDiff(getPath('beforeRecursive', 'ini'), getPath('afterRecursive', 'ini'))).toBe(expected);
  });
});

describe('compare two flat files with format plain', () => {
  let expected;
  beforeAll(() => {
    expected = getExpected('diffFlatPlain.txt');
  });

  test('.json', () => {
    expect(genDiff(getPath('before', 'json'), getPath('after', 'json'), 'plain')).toBe(expected);
  });
  test('.yaml', () => {
    expect(genDiff(getPath('before', 'yaml'), getPath('after', 'yaml'), 'plain')).toBe(expected);
  });
  test('.ini', () => {
    expect(genDiff(getPath('before', 'ini'), getPath('after', 'ini'), 'plain')).toBe(expected);
  });
});

describe('compare two recursive files with format plain', () => {
  let expected;
  beforeAll(() => {
    expected = getExpected('diffRecursivePlain.txt');
  });

  test('.json', () => {
    expect(genDiff(getPath('beforeRecursive', 'json'), getPath('afterRecursive', 'json'), 'plain')).toBe(expected);
  });
  test('.yaml', () => {
    expect(genDiff(getPath('beforeRecursive', 'yaml'), getPath('afterRecursive', 'yaml'), 'plain')).toBe(expected);
  });
  test('.ini', () => {
    expect(genDiff(getPath('beforeRecursive', 'ini'), getPath('afterRecursive', 'ini'), 'plain')).toBe(expected);
  });
});
