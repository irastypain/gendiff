import _ from 'lodash';

export const out = preparedData => preparedData;

export const getLevel = parents => parents.length;

export const formatLines = lines => lines.filter(line => line !== 'unchanged').join('\n');

const formatValue = (rawValue) => {
  const formattedValue = _.isObject(rawValue) ? 'complex value' : `value: ${rawValue}`;
  return formattedValue;
};

const getFullName = (parents, name) => [...parents.map(item => item.key), name].join('.');

export const formatNested = (context) => {
  const { value } = context;
  return [value];
};

export const formatAdded = (context) => {
  const { key, value, parents } = context;
  return [`Property '${getFullName(parents, key)}' was added with ${formatValue(value)}`];
};

export const formatDeleted = (context) => {
  const { key, parents } = context;
  return [`Property '${getFullName(parents, key)}' was removed`];
};

export const formatUnchanged = (context) => {
  const { type } = context;
  return [type];
};

export const formatUpdated = (context) => {
  const { key, value, parents } = context;
  return [`Property '${getFullName(parents, key)}' was updated. From '${value.old}' to '${value.new}'`];
};
