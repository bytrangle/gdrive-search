#!/usr/bin/env node
const commander = require('commander');
const chalk = require('chalk');
const pkg = require('../package.json');
const search = require('../commands/search');
const auth = require('../commands/auth');
const util = require('../lib/util');

const program = new commander.Command();
program.version(
  pkg.version,
  '-v, --vers',
  'Output the current version',
);

// program
//   .command('search <keyword>')
//   .alias('s')
//   .description(
//     `Search files in Google Drive that match a given keyword. By default, the search range includes ${chalk.italic(
//       'title, description and indexable text',
//     )}`,
//   )
//   .option('-o, --owned', 'Search files owned by me only')
//   .option(
//     '-f, --file-type <type>',
//     `Restrict search to certain file types. Accepted file types are ${chalk.cyan(
//       'sheets, forms, docs, slides.',
//     )} If invalid file types are provided, default to search for all file types`,
//   )
//   .option('-n, --name-only', 'Search by file name only')
//   .action((keyword, cmdObj) => {
//     console.log('waiting');
//     return search(keyword, cmdObj);
//   });

program
  .command(
    'search <keyword>',
    'Search files in Google Drive that match a given keyword. Please wrap multi-words in single quotes',
  )
  .alias('s')
  .command('authorize')
  .description(
    'Grant this app permission to view files in your Google Drive ',
  )
  .action(() => auth.getAccessToken().catch(util.handleError));
program.parse(process.argv);
