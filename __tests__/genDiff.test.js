import fs from 'fs';
import genDiff from '../src/index';

const pathToFixtures = `${__dirname}/__fixtures__`;
const buildPath = (filename, type) => `${pathToFixtures}/${type}/${filename}.${type}`;

const flatTest = (type) => {
  test(`compare two flat .${type} files`, () => {
    const pathToFirstFile = buildPath('before', type);
    const pathToSecondFile = buildPath('after', type);
    const expected = fs.readFileSync(`${pathToFixtures}/diffFlat.txt`, 'utf-8');
    expect(genDiff(pathToFirstFile, pathToSecondFile)).toBe(expected);
  });
};

const recursiveTest = (type) => {
  test(`compare two recursive .${type} files`, () => {
    const pathToFirstFile = buildPath('beforeRecursive', type);
    const pathToSecondFile = buildPath('afterRecursive', type);
    const expected = fs.readFileSync(`${pathToFixtures}/diffRecursive.txt`, 'utf-8');
    expect(genDiff(pathToFirstFile, pathToSecondFile)).toBe(expected);
  });
};

const flatPlainTest = (type) => {
  test(`compare two flat .${type} files with format plain`, () => {
    const pathToFirstFile = buildPath('before', type);
    const pathToSecondFile = buildPath('after', type);
    const expected = fs.readFileSync(`${pathToFixtures}/diffFlatPlain.txt`, 'utf-8');
    expect(genDiff(pathToFirstFile, pathToSecondFile, 'plain')).toBe(expected);
  });
};

const recursivePlainTest = (type) => {
  test(`compare two recursive .${type} files with format plain`, () => {
    const pathToFirstFile = buildPath('beforeRecursive', type);
    const pathToSecondFile = buildPath('afterRecursive', type);
    const expected = fs.readFileSync(`${pathToFixtures}/diffRecursivePlain.txt`, 'utf-8');
    expect(genDiff(pathToFirstFile, pathToSecondFile, 'plain')).toBe(expected);
  });
};

const types = [
  'json',
  'yaml',
  'ini',
];

const tests = [
  flatTest,
  recursiveTest,
  flatPlainTest,
  recursivePlainTest,
];

tests.map(test => types.map(test));
