import _ from 'lodash';

const signs = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
  nested: ' ',
  updated: ' ',
};

const formatLines = (lines, levelIdent) => {
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

const formatDiff = (diff, level = 0) => {
  const lines = diff.reduce((acc, node) => {
    const { type, key } = node;

    if (type === 'nested') {
      return [...acc, `  ${signs[type]} ${key}: ${formatDiff(node.children, level + 1)}`];
    } else if (type === 'updated') {
      return [
        ...acc,
        `  ${signs.added} ${key}: ${node.newValue}`,
        `  ${signs.deleted} ${key}: ${node.oldValue}`,
      ];
    }
    return [...acc, `  ${signs[type]} ${key}: ${formatValue(node.value, level)}`];
  }, []);

  return formatLines(lines, level);
};

export default formatDiff;
