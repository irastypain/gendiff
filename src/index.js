import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';

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

const getTypeFile = (filepath) => {
  const ext = path.extname(filepath).replace('.', '');
  if (ext === 'yml') {
    return 'yaml';
  }
  return ext;
};

const getParser = type => {
  const parsers = {
    json: (file) => JSON.parse(file),
    yaml: (file) => yaml.load(file),
  };
  return parsers[type];
};

const getContent = (pathToFile) => {
  const encoding = 'utf-8';
  const file = fs.readFileSync(pathToFile, encoding);
  const parser = getParser(getTypeFile(pathToFile));
  return parser(file);
};

const getDiff = (fstContent, sndContent) => {
  const fstKeys = Object.keys(fstContent);
  const sndKeys = Object.keys(sndContent);

  const diff = _.union(fstKeys, sndKeys).map((key) => {
    if (_.isEqual(fstContent[key], sndContent[key])) {
      return buildDiffItem('equal', key, fstContent[key]);
    } else if (!fstKeys.includes(key)) {
      return buildDiffItem('added', key, sndContent[key]);
    } else if (!sndKeys.includes(key)) {
      return buildDiffItem('deleted', key, fstContent[key]);
    }
    return [buildDiffItem('changedTo', key, sndContent[key]), buildDiffItem('changedFrom', key, fstContent[key])];
  });

  return _.flatten(diff);
};

export default (pathToFstFile, pathToSndFile) => {
  const fstContent = getContent(pathToFstFile);
  const sndContent = getContent(pathToSndFile);
  return formatDiff(getDiff(fstContent, sndContent));
};
