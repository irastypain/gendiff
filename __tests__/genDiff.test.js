import fs from 'fs';
import genDiff from '../src/index';

const pathToFixtures = `${__dirname}/__fixtures__`;


const expectedFlat = fs.readFileSync(`${pathToFixtures}/diffFlat.txt`, 'utf-8');

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


const expectedRecursive = fs.readFileSync(`${pathToFixtures}/diffRecursive.txt`, 'utf-8');

test('compare two recursive .json files', () => {
  const pathToFstFile = `${pathToFixtures}/json/beforeRecursive.json`;
  const pathToSndFile = `${pathToFixtures}/json/afterRecursive.json`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expectedRecursive);
});

test('compare two recursive .yaml files', () => {
  const pathToFstFile = `${pathToFixtures}/yaml/beforeRecursive.yaml`;
  const pathToSndFile = `${pathToFixtures}/yaml/afterRecursive.yaml`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expectedRecursive);
});

test('compare two recursive .ini files', () => {
  const pathToFstFile = `${pathToFixtures}/ini/beforeRecursive.ini`;
  const pathToSndFile = `${pathToFixtures}/ini/afterRecursive.ini`;
  expect(genDiff(pathToFstFile, pathToSndFile)).toBe(expectedRecursive);
});
