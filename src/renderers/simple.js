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

const formatObject = (object, levelIdent) => {
  const lines = _.keys(object).map(key => `    ${key}: ${object[key]}`);
  return formatLines(lines, levelIdent);
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
      const value = _.isObject(newValue) ? formatObject(newValue, level + 1) : newValue;
      return `  ${signs.added} ${name}: ${value}`;
    } else if (type === 'deleted') {
      const value = _.isObject(oldValue) ? formatObject(oldValue, level + 1) : oldValue;
      return `  ${signs.deleted} ${name}: ${value}`;
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
