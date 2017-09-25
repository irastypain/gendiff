import fs from 'fs';
import _ from 'lodash';

const formatDiff = (diff) => {
  const result = [...diff].map(item => `  ${item.action} ${item.key}: ${item.val}`);
  return `{\n${result.join('\n')}\n}`;
};

const buildDiffItem = (sign, property, value) => {
  const item = { action: sign, key: property, val: value };
  return item;
};

const delSign = '-';
const addSign = '+';
const eqSign = ' ';

const getContent = (pathToFile) => {
  const encoding = 'utf-8';
  return JSON.parse(fs.readFileSync(pathToFile, encoding));
};

export default (pathToFstFile, pathToSndFile) => {
  const fstContent = getContent(pathToFstFile);
  const sndContent = getContent(pathToSndFile);
  const fstKeys = Object.keys(fstContent);
  const sndKeys = Object.keys(sndContent);

  const fstPartDiff = fstKeys.reduce((acc, key) => {
    const fstValue = fstContent[key];

    if (!sndKeys.includes(key)) {
      acc.add(buildDiffItem(delSign, key, fstValue));
    } else if (_.isEqual(fstValue, sndContent[key])) {
      acc.add(buildDiffItem(eqSign, key, fstValue));
    } else {
      acc.add(buildDiffItem(addSign, key, sndContent[key]));
      acc.add(buildDiffItem(delSign, key, fstValue));
    }

    return acc;
  }, new Set());

  const sndPartDiff = sndKeys.filter(key => !fstKeys.includes(key))
    .reduce((acc, key) => acc.add(buildDiffItem(addSign, key, sndContent[key])), new Set());

  return formatDiff(new Set([...fstPartDiff, ...sndPartDiff]));
};
