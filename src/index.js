import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini-config-parser';

const render = (ast, format) => {
  const formatDiff = (diff, level = 0) => {
    const signs = {
      equal: ' ',
      added: '+',
      deleted: '-',
      changedFrom: '-',
      changedTo: '+',
    };

    const formatLines = (lines, levelIdent) => {
      const ident = '    '.repeat(levelIdent);
      return `{\n${ident}${lines.join(`\n${ident}`)}\n${ident}}`;
    };

    const formatObject = (object, levelIdent) => {
      const lines = _.keys(object).map(key => `    ${key}: ${object[key]}`);
      return formatLines(lines, levelIdent);
    };

    const formatNode = (node) => {
      const {
        type,
        name,
        value,
        children,
      } = node;

      if (!_.isEmpty(children)) {
        return `  ${signs[type]} ${name}: ${formatDiff(children, level + 1)}`;
      } else if (_.isObject(value)) {
        return `  ${signs[type]} ${name}: ${formatObject(value, level + 1)}`;
      }
      return `  ${signs[type]} ${name}: ${value}`;
    };

    const lines = diff.map(formatNode);
    return formatLines(lines, level);
  };

  const formatPlain = (diff, parents = []) => {
    const formatLines = lines => lines.filter(line => !_.isEmpty(line)).join('\n');
    const lines = diff.map((node, index) => {
      const { type, value, children } = node;
      const fullName = [...parents, node].map(item => item.name).join('.');

      if (!_.isEmpty(children)) {
        return formatPlain(children, [...parents, node]);
      } else if (type === 'added') {
        const valueText = _.isObject(value) ? 'complex value' : `value: ${value}`;
        return `Property '${fullName}' was ${type} with ${valueText}`;
      } else if (type === 'deleted') {
        return `Property '${fullName}' was removed`;
      } else if (type === 'changedTo') {
        const oldValue = diff[index + 1].value;
        const newValue = value;
        return `Property '${fullName}' was updated. From '${oldValue}' to '${newValue}'`;
      }
      return '';
    });
    return formatLines(lines);
  };

  const formatAst = (formatType, data) => {
    const formatters = {
      default: diff => formatDiff(diff),
      plain: diff => formatPlain(diff),
    };
    return formatters[formatType](data);
  };

  return formatAst(format, ast);
};

const makeNode = (type, name, value, children = []) => {
  const item = {
    type,
    name,
    value,
    children,
  };
  return item;
};

const parse = (format, fileData) => {
  const parsers = {
    json: data => JSON.parse(data),
    yaml: data => yaml.load(data),
    ini: data => ini.parse(data),
  };
  return parsers[format](fileData);
};

const getFormat = (filePath) => {
  const ext = path.extname(filePath).replace('.', '');
  if (ext === 'yml') {
    return 'yaml';
  }
  return ext;
};

const getContent = (pathToFile) => {
  const encoding = 'utf-8';
  const fileData = fs.readFileSync(pathToFile, encoding);
  const format = getFormat(pathToFile);
  return parse(format, fileData);
};

const getDiff = (dataBefore, dataAfter) => {
  const dataBeforeKeys = Object.keys(dataBefore);
  const dataAfterKeys = Object.keys(dataAfter);

  const diff = _.union(dataBeforeKeys, dataAfterKeys).map((key) => {
    if (_.isEqual(dataBefore[key], dataAfter[key])) {
      return makeNode('equal', key, dataBefore[key]);
    } else if (_.isObject(dataBefore[key]) && _.isObject(dataAfter[key])) {
      return makeNode('equal', key, null, getDiff(dataBefore[key], dataAfter[key]));
    } else if (!dataBeforeKeys.includes(key)) {
      return makeNode('added', key, dataAfter[key]);
    } else if (!dataAfterKeys.includes(key)) {
      return makeNode('deleted', key, dataBefore[key]);
    }
    return [makeNode('changedTo', key, dataAfter[key]), makeNode('changedFrom', key, dataBefore[key])];
  });

  return _.flatten(diff);
};

export default (pathToFirstFile, pathToSecondFile, format = 'default') => {
  const dataBefore = getContent(pathToFirstFile);
  const dataAfter = getContent(pathToSecondFile);
  return render(getDiff(dataBefore, dataAfter), format);
};
