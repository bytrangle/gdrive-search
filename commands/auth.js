const { google } = require('googleapis');
const inquirer = require('inquirer');
const pkg = require('../package-lock.json');
const CredentialManager = require('../lib/credentialManager');
const util = require('../lib/util');

const SCOPES = [
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];
const creds = new CredentialManager(pkg.name);

async function getUserInfo(auth) {
  const drive = google.drive({ version: 'v3', auth });
  try {
    const res = await drive.about.get({ fields: 'user' });
    const { user } = res.data;
    const { displayName, emailAddress } = user;
    console.log(
      `You have successfully authenticated under email ${emailAddress} with display name ${displayName}`,
    );
    return { displayName, emailAddress };
  } catch (err) {
    return console.log(`Error retrieving user info: ${err}`);
  }
}

const oAuth2Client = util.createOAuth2Client();

async function getAccessToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  await inquirer.prompt({
    type: 'input',
    message:
      'Please press Enter to open Googole Drive in your default browser and authorize access',
    name: 'continue',
  });
  util.openBrowser(authUrl);
  const code = await inquirer.prompt({
    type: 'input',
    message: 'Please enter the code provided by Google Drive',
    name: 'code',
    validate: util.notEmpty,
  });
  oAuth2Client.getToken(code, async (err, token) => {
    if (err) throw new Error(`Error retrieving access token: ${err}`);
    oAuth2Client.setCredentials(token);
    const userInfo = await getUserInfo(oAuth2Client);
    console.log(userInfo);
    // Store the token objects to $HOME/.config/configstore for later program executions
    const res = await creds.storeMultipleItems({
      tokens: token,
      user: userInfo,
    });
    console.log(`Token and user info have been ${res}`);
  });
}

async function authentication() {
  const tokens = await creds.getConfig('tokens');
  oAuth2Client.setCredentials(tokens);
  return oAuth2Client;
}

module.exports = { getAccessToken, authentication };
