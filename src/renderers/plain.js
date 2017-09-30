import _ from 'lodash';

export const out = preparedData => preparedData;

export const getLevel = parents => parents.length;

export const formatLines = lines => lines.filter(line => !_.isEmpty(line)).join('\n');

const formatValue = (rawValue) => {
  const formattedValue = _.isObject(rawValue) ? 'complex value' : `value: ${rawValue}`;
  return formattedValue;
};

const getFullName = (parents, node) => [...parents, node].map(item => item.key).join('.');

export const formatNested = (formatter, context) => {
  const { node, parents } = context;
  return [formatter(node.children, [...parents, node])];
};

export const formatAdded = (context) => {
  const { node, parents } = context;
  return [`Property '${getFullName(parents, node)}' was added with ${formatValue(node.value)}`];
};

export const formatDeleted = (context) => {
  const { node, parents } = context;
  return [`Property '${getFullName(parents, node)}' was removed`];
};

export const formatUnchanged = () => [''];

export const formatUpdated = (context) => {
  const { node, parents } = context;
  return [`Property '${getFullName(parents, node)}' was updated. From '${node.oldValue}' to '${node.newValue}'`];
};
