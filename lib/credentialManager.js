const Configstore = require('configstore');
const inquirer = require('inquirer');
const keytar = require('keytar');

class CredentialManager {
  constructor(name) {
    this.conf = new Configstore(name);
    this.service = name;
  }

  async getIdAndSecret() {
    const id = this.conf.get('client_id');
    if (id) {
      const secret = await keytar.getPassword(this.service, id);
      return [id, secret];
    }
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'id',
        message: 'Enter your client id: ',
      },
      {
        type: 'password',
        name: 'secret',
        message: 'Enter your client secret',
      },
    ]);
    this.conf.set('client_id', answers.id);
    await keytar.setPassword(
      this.service,
      answers.id,
      answers.secret,
    );
    return [answers.id, answers.secret];
  }
}

module.exports = CredentialManager;
