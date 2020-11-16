#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const util = require('../lib/util');
const search = require('../commands/search');

const program = new Command();
program
  .option('-o, --owned', 'Search files owned by me only')
  .option(
    '-f, --file-type <type>',
    `Restrict search to certain file types. Accepted file types are ${chalk.cyan(
      'sheets, forms, docs, slides.',
    )} If invalid file types are provided, default to search for all file types`,
  )
  .option('-n, --name-only', 'Search by file name only');

program.parse(process.argv);
if (program.args > 1) {
  util.handleError('Please wrap multi-word in single quotes');
}
const keyword = program.args[0];
const { owned, fileType, nameOnly } = program;
const drive = owned ? 'my Drive' : 'my Drive and shared Drive';
const file = fileType
  ? `Google ${fileType[0].toUpperCase()}${fileType.slice(1)}`
  : ``;
const searchRange = nameOnly
  ? 'file names'
  : 'file names, descriptions, content, and indexable text';
const message = `Searching for ${chalk.italic(
  file,
)} files in ${chalk.italic(drive)} whose ${chalk.italic(
  searchRange,
)} match keyword ${chalk.bgRed(keyword)}`;
util.displayNotifcation(message);
const ownerArg = owned ? 'me' : undefined;
const searchRangeArg = nameOnly ? 'name' : undefined;
const fileArg = fileType || undefined;
search(keyword, ownerArg, searchRangeArg, fileArg);
