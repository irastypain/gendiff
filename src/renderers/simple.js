import _ from 'lodash';

export const out = preparedData => preparedData;

export const getLevel = parents => parents.length;

export const formatLines = (lines, levelIdent) => {
  const ident = '    '.repeat(levelIdent);
  return `{\n${ident}${lines.join(`\n${ident}`)}\n${ident}}`;
};

const formatValue = (rawValue, levelIdent) => {
  if (_.isObject(rawValue)) {
    const lines = _.keys(rawValue).map(key => `    ${key}: ${rawValue[key]}`);
    return formatLines(lines, levelIdent + 1);
  }
  return `${rawValue}`;
};

const signs = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
  nested: ' ',
};

const formatDefault = (context) => {
  const {
    type,
    key,
    value,
    parents,
  } = context;
  return [`  ${signs[type]} ${key}: ${formatValue(value, getLevel(parents))}`];
};

export const formatNested = (context) => {
  const { key, value } = context;
  return [`  ${signs.nested} ${key}: ${value}`];
};

export const formatAdded = formatDefault;

export const formatDeleted = formatDefault;

export const formatUnchanged = formatDefault;

export const formatUpdated = (context) => {
  const { key, newValue, oldValue } = context;
  return [
    `  ${signs.added} ${key}: ${newValue}`,
    `  ${signs.deleted} ${key}: ${oldValue}`,
  ];
};
