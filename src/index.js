import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const formatDiff = (diff) => {
  const signs = {
    equal: ' ',
    added: '+',
    deleted: '-',
    changedFrom: '-',
    changedTo: '+',
  };
  const lines = diff.map(item => `  ${signs[item.action]} ${item.property}: ${item.value}`);
  return `{\n${lines.join('\n')}\n}`;
};

const buildDiffItem = (act, key, val) => {
  const item = { action: act, property: key, value: val };
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

  const diff = _.union(dataBeforeKeys, dataAfterKeys).map((key) => {
    if (_.isEqual(dataBefore[key], dataAfter[key])) {
      return buildDiffItem('equal', key, dataBefore[key]);
    } else if (!dataBeforeKeys.includes(key)) {
      return buildDiffItem('added', key, dataAfter[key]);
    } else if (!dataAfterKeys.includes(key)) {
      return buildDiffItem('deleted', key, dataBefore[key]);
    }
    return [buildDiffItem('changedTo', key, dataAfter[key]), buildDiffItem('changedFrom', key, dataBefore[key])];
  });

  return _.flatten(diff);
};

export default (pathToFirstFile, pathToSecondFile) => {
  const dataBefore = getContent(pathToFirstFile);
  const dataAfter = getContent(pathToSecondFile);
  return formatDiff(getDiff(dataBefore, dataAfter));
};
