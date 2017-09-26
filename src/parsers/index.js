import json from './jsonparser';
import yaml from './yamlparser';
import ini from './iniparser';

const parsers = { json, yaml, ini };

export default (format, file) => {
  const parser = parsers[format];
  return parser(file);
};
