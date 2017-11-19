import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import render from './renderers';

const parse = (format, fileData) => {
  const parsers = {
    json: JSON.parse,
    yaml: yaml.load,
    ini: ini.parse,
  };
  return parsers[format](fileData);
};

const getFormat = (filePath) => {
  const ext = path.extname(filePath).replace('.', '');
  if (ext === 'yml') {
    return 'yaml';
  }
  return ext;
};

const getData = (pathToFile) => {
  const encoding = 'utf-8';
  const fileData = fs.readFileSync(pathToFile, encoding);
  const format = getFormat(pathToFile);
  return parse(format, fileData);
};

const types = [
  {
    type: 'nested',
    check: (first, second, key) => _.isObject(first[key]) && _.isObject(second[key]),
    process: (first, second, func) => func(first, second),
  },
  {
    type: 'unchanged',
    check: (first, second, key) => _.isEqual(first[key], second[key]),
    process: first => _.identity(first),
  },
  {
    type: 'updated',
    check: (first, second, key) => _.has(first, key) && _.has(second, key)
      && (first[key] !== second[key]),
    process: (first, second) => ({ old: first, new: second }),
  },
  {
    type: 'added',
    check: (first, second, key) => !_.has(first, key) && _.has(second, key),
    process: (first, second) => _.identity(second),
  },
  {
    type: 'deleted',
    check: (first, second, key) => _.has(first, key) && !_.has(second, key),
    process: first => _.identity(first),
  },
];

const getAst = (dataBefore = {}, dataAfter = {}) => {
  const dataBeforeKeys = Object.keys(dataBefore);
  const dataAfterKeys = Object.keys(dataAfter);

  return _.union(dataBeforeKeys, dataAfterKeys).map((key) => {
    const { type, process } = _.find(types, item => item.check(dataBefore, dataAfter, key));
    const value = process(dataBefore[key], dataAfter[key], getAst);
    return { type, key, value };
  });
};

export default (path1, path2, formatType = 'simple') => {
  const ast = getAst(getData(path1), getData(path2));
  return render(ast, formatType);
};
