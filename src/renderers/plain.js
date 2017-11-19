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

export default (ast) => {
  const format = (diff, parents = []) => {
    const func = (node) => {
      const { type } = node;
      switch (type) {
        case 'nested': {
          const value = format(node.value, [...parents, node]);
          return formatNested({ ...node, parents, value });
        }
        case 'added':
          return formatAdded({ ...node, parents });
        case 'deleted':
          return formatDeleted({ ...node, parents });
        case 'updated':
          return formatUpdated({ ...node, parents });
        default:
          return formatUnchanged({ ...node, parents });
      }
    };

    const lines = diff.reduce((acc, node) => [...acc, ...func(node)], []);
    return formatLines(lines, getLevel(parents));
  };

  return out(format(ast));
};
