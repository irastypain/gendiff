import simple from './simple';
import plain from './plain';

export default (format) => {
  const renderers = { simple, plain };
  return renderers[format];
};
