const { google } = require('googleapis');
const opn = require('opn');
const chalk = require('chalk');
const pkg = require('../package-lock.json');
const CredentialManager = require('./credentialManager');

const notEmpty = (input) =>
  input === '' ? 'This value is required' : true;

const openBrowser = (url) => opn(url);

const createOAuth2Client = () => {
  const {
    CLIENT_ID: clientId,
    CLIENT_SECRET: clientSecret,
    REDIRECT_URI: redirectUri,
  } = process.env;
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );
  return oAuth2Client;
};

const loadConfig = (prop) => {
  const creds = new CredentialManager(pkg.name);
  const config = creds.getConfig(prop);
  if (!config)
    return console.log(`
  No config with the name ${chalk.red(prop)} found.`);
  return config;
};

const displayNotifcation = (message) => {
  console.info(chalk.green(message));
};
const handleError = (message) => {
  console.error(chalk.red(message));
  process.exitCode = 1;
};

module.exports = {
  notEmpty,
  openBrowser,
  loadConfig,
  createOAuth2Client,
  displayNotifcation,
  handleError,
};
