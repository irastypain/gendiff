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
      const context = { node, parents };
      switch (type) {
        case 'nested':
          return renderer.formatNested(format, context);
        case 'added':
          return renderer.formatAdded(context);
        case 'deleted':
          return renderer.formatDeleted(context);
        case 'updated':
          return renderer.formatUpdated(context);
        default:
          return renderer.formatUnchanged(context);
      }
    };

    const lines = diff.reduce((acc, node) => [...acc, ...func(node)], []);
    return renderer.formatLines(lines, renderer.getLevel(parents));
  };

  return renderer.out(format(ast));
};
