import _ from 'lodash';

const signs = {
  equal: ' ',
  added: '+',
  deleted: '-',
  changedFrom: '-',
  changedTo: '+',
};

const formatLines = (lines, levelIdent) => {
  const ident = '    '.repeat(levelIdent);
  return `{\n${ident}${lines.join(`\n${ident}`)}\n${ident}}`;
};

const formatValue = (value, levelIdent) => {
  if (_.isObject(value)) {
    const lines = _.keys(value).map(key => `    ${key}: ${value[key]}`);
    return formatLines(lines, levelIdent + 1);
  }
  return `${value}`;
};

const formatDiff = (diff, level = 0) => {
  const lines = _.flatten(diff.map((node) => {
    const {
      type,
      name,
      oldValue,
      newValue,
      children,
    } = node;

    if (!_.isEmpty(children)) {
      return `  ${signs[type]} ${name}: ${formatDiff(children, level + 1)}`;
    } else if (type === 'added') {
      return `  ${signs[type]} ${name}: ${formatValue(newValue, level)}`;
    } else if (type === 'deleted') {
      return `  ${signs[type]} ${name}: ${formatValue(oldValue, level)}`;
    } else if (type === 'changed') {
      return [
        `  ${signs.changedTo} ${name}: ${newValue}`,
        `  ${signs.changedFrom} ${name}: ${oldValue}`,
      ];
    }
    return `    ${name}: ${newValue}`;
  }));

  return formatLines(lines, level);
};

export default formatDiff;
