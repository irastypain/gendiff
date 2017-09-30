import _ from 'lodash';

const formatLines = lines => lines.filter(line => !_.isEmpty(line)).join('\n');

const formatPlain = (diff, parents = []) => {
  const lines = diff.map((node) => {
    const {
      type,
      oldValue,
      newValue,
      children,
    } = node;
    const fullName = [...parents, node].map(item => item.name).join('.');

    if (!_.isEmpty(children)) {
      return formatPlain(children, [...parents, node]);
    } else if (type === 'added') {
      const valueText = _.isObject(newValue) ? 'complex value' : `value: ${newValue}`;
      return `Property '${fullName}' was added with ${valueText}`;
    } else if (type === 'deleted') {
      return `Property '${fullName}' was removed`;
    } else if (type === 'changed') {
      return `Property '${fullName}' was updated. From '${oldValue}' to '${newValue}'`;
    }

    return '';
  });

  return formatLines(lines);
};

export default formatPlain;
