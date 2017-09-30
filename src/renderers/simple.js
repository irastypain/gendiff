import _ from 'lodash';

export const out = preparedData => preparedData;

export const getLevel = parents => parents.length;

export const formatLines = (lines, levelIdent) => {
  const ident = '    '.repeat(levelIdent);
  return `{\n${ident}${lines.join(`\n${ident}`)}\n${ident}}`;
};

const formatValue = (rawValue, parents) => {
  if (_.isObject(rawValue)) {
    const lines = _.keys(rawValue).map(key => `    ${key}: ${rawValue[key]}`);
    return formatLines(lines, getLevel(parents) + 1);
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
  const { node, parents } = context;
  return [`  ${signs[node.type]} ${node.key}: ${formatValue(node.value, parents)}`];
};

export const formatNested = (formatter, context) => {
  const { node, parents } = context;
  return [`  ${signs.nested} ${node.key}: ${formatter(node.children, [...parents, node])}`];
};

export const formatAdded = formatDefault;

export const formatDeleted = formatDefault;

export const formatUnchanged = formatDefault;

export const formatUpdated = (context) => {
  const { node } = context;
  return [
    `  ${signs.added} ${node.key}: ${node.newValue}`,
    `  ${signs.deleted} ${node.key}: ${node.oldValue}`,
  ];
};
