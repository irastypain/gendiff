import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini-config-parser';
import getRenderer from './renderers';

const makeNode = (type, name, oldValue, newValue, children = []) => {
  const item = {
    type,
    name,
    oldValue,
    newValue,
    children,
  };
  return item;
};

const parse = (format, fileData) => {
  const parsers = {
    json: data => JSON.parse(data),
    yaml: data => yaml.load(data),
    ini: data => ini.parse(data),
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

const getContent = (pathToFile) => {
  const encoding = 'utf-8';
  const fileData = fs.readFileSync(pathToFile, encoding);
  const format = getFormat(pathToFile);
  return parse(format, fileData);
};

const getDiff = (dataBefore, dataAfter) => {
  const dataBeforeKeys = Object.keys(dataBefore);
  const dataAfterKeys = Object.keys(dataAfter);

  return _.union(dataBeforeKeys, dataAfterKeys).map((key) => {
    if (_.isEqual(dataBefore[key], dataAfter[key])) {
      return makeNode('equal', key, null, dataBefore[key]);
    } else if (_.isObject(dataBefore[key]) && _.isObject(dataAfter[key])) {
      return makeNode('equal', key, dataBefore[key], dataAfter[key], getDiff(dataBefore[key], dataAfter[key]));
    } else if (!dataBeforeKeys.includes(key)) {
      return makeNode('added', key, null, dataAfter[key]);
    } else if (!dataAfterKeys.includes(key)) {
      return makeNode('deleted', key, dataBefore[key], null);
    }
    return makeNode('changed', key, dataBefore[key], dataAfter[key]);
  });
};

export default (pathToFirstFile, pathToSecondFile, format = 'simple') => {
  const dataBefore = getContent(pathToFirstFile);
  const dataAfter = getContent(pathToSecondFile);
  const render = getRenderer(format);
  return render(getDiff(dataBefore, dataAfter));
};
