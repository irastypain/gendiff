import _ from 'lodash';

const out = preparedData => preparedData;

const getLevel = parents => parents.length;

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

const signs = {
  unchanged: ' ',
  added: '+',
  deleted: '-',
  nested: ' ',
};

const formatDefault = (context) => {
  const {
    type,
    key,
    value,
    parents,
  } = context;
  return [`  ${signs[type]} ${key}: ${formatValue(value, getLevel(parents))}`];
};

const formatNested = (context) => {
  const { key, value } = context;
  return [`  ${signs.nested} ${key}: ${value}`];
};

const formatAdded = formatDefault;

const formatDeleted = formatDefault;

const formatUnchanged = formatDefault;

const formatUpdated = (context) => {
  const { key, value } = context;
  return [
    `  ${signs.added} ${key}: ${value.new}`,
    `  ${signs.deleted} ${key}: ${value.old}`,
  ];
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
