import simple from './simple';
import plain from './plain';
import json from './json';

export default (format) => {
  const renderers = { simple, plain, json };
  return renderers[format];
};
