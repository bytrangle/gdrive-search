#! /usr/bin/env node

require('dotenv').config();
const { program } = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');
const search = require('../commands/search');
const auth = require('../commands/auth');
const util = require('../lib/util');

program.version(
  pkg.version,
  '-v, --vers',
  'Output the current version',
);

program
  .command('search <keyword>')
  .alias('s')
  .description(
    `Search files in Google Drive that match a given keyword. By default, the search range includes ${chalk.italic(
      'title, description and indexable text',
    )}`,
  )
  .option('-o, --owned', 'Search files owned by me only')
  .option(
    '-f, --file-type <type>',
    `Restrict search to certain file types. Accepted file types are ${chalk.cyan(
      'sheets, forms, docs, slides.',
    )} If invalid file types are provided, default to search for all file types`,
  )
  .option('-n, --name-only', 'Search by file name only')
  .action((keyword, cmdObj) => {
    const { owned, nameOnly, fileType } = cmdObj;
    const file = fileType ? `Google ${fileType}` : '';
    const searchRange = nameOnly
      ? 'name'
      : 'name, description, content, and indexable text';
    const owner = owned ? 'my Drive' : 'my Drive and shared Drive';

    const msg = `🔎 Searching for ${chalk.italic(
      file,
    )} files in ${chalk.italic(
      owner,
    )} whose ${searchRange} match the keyword ${chalk.underline(
      keyword,
    )}`;
    util.displayNotifcation(msg);
    const ownerArg = owned ? 'me' : undefined;
    const searchRangeArg = nameOnly ? 'name' : undefined;
    const fileArg = fileType || undefined;
    console.log(fileArg);
    const argArr = [keyword, ownerArg, searchRangeArg, fileArg];
    console.log(argArr);
    search(...argArr);
  });
program
  .command('authorize')
  .description(
    'Grant this app permission to view files in your Google Drive ',
  )
  .action(() => auth.getAccessToken().catch(util.handleError));
program.parse(process.argv);
