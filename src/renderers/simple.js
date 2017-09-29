import _ from 'lodash';

const formatDiff = (diff, level = 0) => {
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

  const formatNode = (node) => {
    const {
      type,
      name,
      value,
      children,
    } = node;

    if (!_.isEmpty(children)) {
      return `  ${signs[type]} ${name}: ${formatDiff(children, level + 1)}`;
    } else if (_.isObject(value)) {
      return `  ${signs[type]} ${name}: ${formatObject(value, level + 1)}`;
    }
    return `  ${signs[type]} ${name}: ${value}`;
  };

  const lines = diff.map(formatNode);
  return formatLines(lines, level);
};

export default formatDiff;
