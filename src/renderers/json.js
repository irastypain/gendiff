import _ from 'lodash';

const formatValue = (rawValue, type) => {
  if (_.isObject(rawValue)) {
    return _.keys(rawValue).reduce((acc, key) => {
      const newAcc = { ...acc, [key]: { type, value: rawValue[key] } };
      return newAcc;
    }, {});
  }
  return rawValue;
};

const nodeTypes = [
  {
    type: 'nested',
    format: (node, func) => ({ [node.key]: { type: node.type, value: func(node.value) } }),
  },
  {
    type: 'updated',
    format: node => ({ [node.key]: { type: node.type, from: node.value.old, to: node.value.new } }),
  },
  {
    type: 'added',
    format: node =>
      ({ [node.key]: { type: node.type, value: formatValue(node.value, node.type) } }),
  },
  {
    type: 'deleted',
    format: node =>
      ({ [node.key]: { type: node.type, value: formatValue(node.value, node.type) } }),
  },
  {
    type: 'unchanged',
    format: node =>
      ({ [node.key]: { type: node.type, value: formatValue(node.value, node.type) } }),
  },
];

const formatAst = ast =>
  ast.reduce((acc, node) => {
    const { format } = _.find(nodeTypes, item => item.type === node.type);
    return { ...acc, ...format(node, formatAst) };
  }, {});


export default ast => JSON.stringify(formatAst(ast));
