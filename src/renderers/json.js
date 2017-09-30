import _ from 'lodash';

export const out = preparedData => JSON.stringify(preparedData);

export const formatLines = (lines) => {
  const objects = lines;
  const keys = _.flatten(objects.map(obj => _.keys(obj)));
  const values = _.flatten(objects.map(obj => _.values(obj)));
  return _.zipObject(keys, values);
};

export const getLevel = parents => parents.length;

export const formatValue = (rawValue, type) => {
  if (_.isObject(rawValue)) {
    return _.keys(rawValue).reduce((acc, key) => {
      const newAcc = { ...acc, [key]: { type, value: rawValue[key] } };
      return newAcc;
    }, {});
  }
  return rawValue;
};

const formatDefault = (context) => {
  const { node } = context;
  return [{ [node.key]: { type: node.type, value: formatValue(node.value, node.type) } }];
};

export const formatNested = (formatter, context) => {
  const { node, parents } = context;
  return [{ [node.key]: { type: node.type, value: formatter(node.children, [...parents, node]) } }];
};

export const formatAdded = formatDefault;

export const formatDeleted = formatDefault;

export const formatUnchanged = formatDefault;

export const formatUpdated = (context) => {
  const { node } = context;
  return [{ [node.key]: { type: node.type, from: node.oldValue, to: node.newValue } }];
};
