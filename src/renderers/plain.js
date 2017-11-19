import _ from 'lodash';

const getFullName = (parents, node) => [...parents, node].map(item => item.key).join('.');

const nodeTypes = [
  {
    type: 'nested',
    format: (node, parents, func) => func(node.value, [...parents, node]),
  },
  {
    type: 'updated',
    format: (node, parents) => {
      const fullName = getFullName(parents, node);
      return `Property '${fullName}' was updated. From '${node.value.old}' to '${node.value.new}'`;
    },
  },
  {
    type: 'added',
    format: (node, parents) => {
      const fullName = getFullName(parents, node);
      const value = _.isObject(node.value) ? 'complex value' : `value: ${node.value}`;
      return `Property '${fullName}' was added with ${value}`;
    },
  },
  {
    type: 'deleted',
    format: (node, parents) => {
      const fullName = getFullName(parents, node);
      return `Property '${fullName}' was removed`;
    },
  },
  {
    type: 'unchanged',
    format: () => '',
  },
];

const formatLines = lines => lines.filter(line => !_.isEmpty(line)).join('\n');

const formatAst = (ast, parents = []) => {
  const lines = ast.map((node) => {
    const { format } = _.find(nodeTypes, item => item.type === node.type);
    return format(node, parents, formatAst);
  });

  return formatLines(lines);
};

export default formatAst;
