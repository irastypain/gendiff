import simple from './simple';
import plain from './plain';
import json from './json';

const getRender = (formatType) => {
  const renders = { simple, plain, json };
  return renders[formatType];
};

export default (ast, formatType) => {
  const render = getRender(formatType);
  return render(ast);
};
