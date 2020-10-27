const { google } = require('googleapis');
const Table = require('cli-table3');
const mimeTypes = require('../lib/mimeTypes');
const auth = require('./auth');
const util = require('../lib/util');

const listFiles = (oAuth2Client, query) => {
  const drive = google.drive({ version: 'v3', auth: oAuth2Client });
  drive.files.list(
    {
      fields: 'nextPageToken, files(id, name, webViewLink)',
      q: query,
      space: 'drive',
      pageToken: null,
    },
    (err, res) => {
      if (err) console.log(`The API returned an error: ${err}`);
      const { files } = res.data;
      if (files.length) {
        console.log('Files:');
        const table = new Table({
          head: ['id', 'name', 'link'],
          colWidths: [20, 30],
          wordWrap: true,
        });
        files.map((file) =>
          table.push([file.id, file.name, file.webViewLink]),
        );
        console.log(table.toString());
      } else {
        console.log('No files found');
      }
    },
  );
};

const search = (
  keyword,
  owner,
  searchRange = 'fullText',
  fileType,
) => {
  // console.log(owner);
  // console.log(mimeType);
  auth
    .authentication()
    .then((oAuth2Client) => {
      // console.log(oAuth2Client);
      let query = `${searchRange} contains '${keyword}'`;
      if (owner) query = `${query} and 'me' in owners`;
      const mimeType = mimeTypes[fileType];
      if (mimeType) query = `${query} and mimeType = '${mimeType}'`;
      console.log(query);
      listFiles(oAuth2Client, query);
    })
    .catch(util.handleError);
};
module.exports = search;
