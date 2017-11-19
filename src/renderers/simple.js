import _ from 'lodash';

const formatLines = (lines, level) => {
  const ident = '    '.repeat(level);
  return `{\n${ident}${lines.join(`\n${ident}`)}\n${ident}}`;
};

const formatValue = (rawValue, level) => {
  if (_.isObject(rawValue)) {
    const lines = _.keys(rawValue).map(key => `    ${key}: ${rawValue[key]}`);
    return formatLines(lines, level + 1);
  }
  return `${rawValue}`;
};

const nodeTypes = [
  {
    type: 'nested',
    format: (node, level, func) => `    ${node.key}: ${func(node.value, level + 1)}`,
  },
  {
    type: 'updated',
    format: (node, level) => {
      const newValue = formatValue(node.value.new, level);
      const oldValue = formatValue(node.value.old, level);
      const ident = '    '.repeat(level);
      return `  + ${node.key}: ${newValue}\n${ident}  - ${node.key}: ${oldValue}`;
    },
  },
  {
    type: 'added',
    format: (node, level) => `  + ${node.key}: ${formatValue(node.value, level)}`,
  },
  {
    type: 'deleted',
    format: (node, level) => `  - ${node.key}: ${formatValue(node.value, level)}`,
  },
  {
    type: 'unchanged',
    format: (node, level) => `    ${node.key}: ${formatValue(node.value, level)}`,
  },
];

const formatAst = (ast, level = 0) => {
  const lines = ast.map((node) => {
    const { format } = _.find(nodeTypes, item => item.type === node.type);
    return format(node, level, formatAst);
  });

  return formatLines(lines, level);
};

export default formatAst;
