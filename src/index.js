import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini-config-parser';

const render = (ast, level = 0) => {
  const signs = {
    equal: ' ',
    added: '+',
    deleted: '-',
    changedFrom: '-',
    changedTo: '+',
  };
  const ident = '    '.repeat(level);
  const isDiff = data => _.isArray(data);

  const formatDiff = diff =>
    diff.map((item) => {
      const { action, property, value } = item;
      if (isDiff(value) || _.isObject(value)) {
        return `  ${signs[action]} ${property}: ${render(value, level + 1)}`;
      }
      return `  ${signs[action]} ${property}: ${value}`;
    });

  const formatObject = object => _.keys(object).map(key => `    ${key}: ${object[key]}`);

  const lines = isDiff(ast) ? formatDiff(ast) : formatObject(ast);
  return `{\n${ident}${lines.join(`\n${ident}`)}\n${ident}}`;
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
    } else if (_.isObject(dataBefore[key]) && _.isObject(dataAfter[key])) {
      return buildDiffItem('equal', key, getDiff(dataBefore[key], dataAfter[key]));
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
  return render(getDiff(dataBefore, dataAfter));
};
