import _ from 'lodash';

const formatValue = (value, type) => {
  if (_.isObject(value)) {
    return _.keys(value).reduce((acc, key) => {
      const newAcc = { ...acc, [key]: { type, value: value[key] } };
      return newAcc;
    }, {});
  }
  return value;
};

const formatJson = (diff) => {
  const result = diff.reduce((acc, node) => {
    const {
      name,
      type,
      oldValue,
      newValue,
      children,
    } = node;

    if (!_.isEmpty(children)) {
      return { ...acc, [name]: { type, value: formatJson(children) } };
    } else if (type === 'added') {
      return { ...acc, [name]: { type, value: formatValue(newValue, type) } };
    } else if (type === 'deleted') {
      return { ...acc, [name]: { type, value: formatValue(oldValue, type) } };
    } else if (type === 'changed') {
      return { ...acc, [name]: { type, from: oldValue, to: newValue } };
    }
    return { ...acc, [name]: { type, value: newValue } };
  }, {});

  return result;
};

export default ast => JSON.stringify(formatJson(ast));
