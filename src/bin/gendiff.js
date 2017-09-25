#!/usr/bin/env node

import program from 'commander';
import config from '../../package.json';

program
  .version(config.version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format')
  .arguments('<firstConfig> <secondConfig>')
  .parse(process.argv);
