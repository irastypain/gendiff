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

const formatJson = (diff) => {
  const result = diff.reduce((acc, node) => {
    const { type, key } = node;

    if (type === 'nested') {
      return { ...acc, [key]: { type, value: formatJson(node.children) } };
    } else if (type === 'updated') {
      return { ...acc, [key]: { type, from: node.oldValue, to: node.newValue } };
    }
    return { ...acc, [key]: { type, value: formatValue(node.value, type) } };
  }, {});

  return result;
};

export default ast => JSON.stringify(formatJson(ast));
