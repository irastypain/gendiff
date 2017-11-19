import _ from 'lodash';

const out = preparedData => JSON.stringify(preparedData);

const formatLines = (lines) => {
  const objects = lines;
  const keys = _.flatten(objects.map(obj => _.keys(obj)));
  const values = _.flatten(objects.map(obj => _.values(obj)));
  return _.zipObject(keys, values);
};

const getLevel = parents => parents.length;

const formatValue = (rawValue, type) => {
  if (_.isObject(rawValue)) {
    return _.keys(rawValue).reduce((acc, key) => {
      const newAcc = { ...acc, [key]: { type, value: rawValue[key] } };
      return newAcc;
    }, {});
  }
  return rawValue;
};

const formatDefault = (context) => {
  const { type, key, value } = context;
  return [{ [key]: { type, value: formatValue(value, type) } }];
};

const formatNested = (context) => {
  const { type, key, value } = context;
  return [{ [key]: { type, value } }];
};

const formatAdded = formatDefault;

const formatDeleted = formatDefault;

const formatUnchanged = formatDefault;

const formatUpdated = (context) => {
  const { type, key, value } = context;
  return [{ [key]: { type, from: value.old, to: value.new } }];
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
