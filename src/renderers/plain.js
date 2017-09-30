import _ from 'lodash';

const formatLines = lines => lines.filter(line => !_.isEmpty(line)).join('\n');
const formatValue = (rawValue) => {
  const formattedValue = _.isObject(rawValue) ? 'complex value' : `value: ${rawValue}`;
  return formattedValue;
};

const formatPlain = (diff, parents = []) => {
  const lines = diff.map((node) => {
    const { type } = node;
    const fullName = [...parents, node].map(item => item.key).join('.');

    if (type === 'nested') {
      return formatPlain(node.children, [...parents, node]);
    } else if (type === 'added') {
      return `Property '${fullName}' was added with ${formatValue(node.value)}`;
    } else if (type === 'deleted') {
      return `Property '${fullName}' was removed`;
    } else if (type === 'updated') {
      return `Property '${fullName}' was updated. From '${node.oldValue}' to '${node.newValue}'`;
    }

    return '';
  });

  return formatLines(lines);
};

export default formatPlain;
