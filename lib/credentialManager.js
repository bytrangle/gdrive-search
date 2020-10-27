const Configstore = require('configstore');
// const inquirer = require('inquirer');
const keytar = require('keytar');
const chalk = require('chalk');
const pkg = require('../package.json');

class CredentialManager {
  constructor(name) {
    this.conf = new Configstore(name);
    this.service = name;
  }

  async getConfig(prop) {
    const configs = this.conf.get(prop);
    if (!configs) {
      throw new Error(
        `No property named ${chalk.italic(
          prop,
        )} found in the file system. Have your run the command ${chalk.bgWhite.bold(
          `'${pkg.name} auth'`,
        )}`,
      );
    }
    return configs;
  }

  async storeOneItem(prop, value) {
    this.conf.set(prop, value);
    const capProp = `${prop[0].toUpperCase()}${prop.slice(1)}`;
    const message = `${capProp} have been saved to $HOME/.config/configstore/${this.service}.json`;
    return message;
  }

  async storeMultipleItems(obj) {
    this.conf.set(obj);
    const message = `saved to $HOME/.config/configstore/${this.service}.json`;
    return message;
  }

  async clearIdAndSecret(prop) {
    const id = this.conf.get(prop);
    this.conf.delete(prop);
    await keytar.deletePassword(this.service, id);
  }

  async getAccessTokenFromKeytar(account) {
    const accessToken = await keytar.getPassword(
      this.service,
      account,
    );
    return accessToken;
  }

  async storeAccessToken(account, secret) {
    await keytar.setPassword(this.service, account, secret);
  }
}

module.exports = CredentialManager;
