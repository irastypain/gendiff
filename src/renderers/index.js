import * as simple from './simple';
import * as plain from './plain';
import * as json from './json';

const getRenderer = (formatType) => {
  const renderers = { simple, plain, json };
  return renderers[formatType];
};

export default (ast, formatType) => {
  const renderer = getRenderer(formatType);

  const format = (diff, parents = []) => {
    const func = (node) => {
      const { type } = node;
      switch (type) {
        case 'nested': {
          const value = format(node.value, [...parents, node]);
          return renderer.formatNested({ ...node, parents, value });
        }
        case 'added':
          return renderer.formatAdded({ ...node, parents });
        case 'deleted':
          return renderer.formatDeleted({ ...node, parents });
        case 'updated':
          return renderer.formatUpdated({ ...node, parents });
        default:
          return renderer.formatUnchanged({ ...node, parents });
      }
    };

    const lines = diff.reduce((acc, node) => [...acc, ...func(node)], []);
    return renderer.formatLines(lines, renderer.getLevel(parents));
  };

  return renderer.out(format(ast));
};
