import _ from 'lodash';

const formatPlain = (diff, parents = []) => {
  const formatLines = lines => lines.filter(line => !_.isEmpty(line)).join('\n');

  const lines = diff.map((node, index) => {
    const { type, value, children } = node;
    const fullName = [...parents, node].map(item => item.name).join('.');

    if (!_.isEmpty(children)) {
      return formatPlain(children, [...parents, node]);
    } else if (type === 'added') {
      const valueText = _.isObject(value) ? 'complex value' : `value: ${value}`;
      return `Property '${fullName}' was ${type} with ${valueText}`;
    } else if (type === 'deleted') {
      return `Property '${fullName}' was removed`;
    } else if (type === 'changedTo') {
      const oldValue = diff[index + 1].value;
      const newValue = value;
      return `Property '${fullName}' was updated. From '${oldValue}' to '${newValue}'`;
    }

    return '';
  });

  return formatLines(lines);
};

export default formatPlain;
