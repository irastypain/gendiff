import json from './jsonparser';
import yaml from './yamlparser';

const parsers = { json, yaml };

export default (format, file) => {
  const parser = parsers[format];
  return parser(file);
};
