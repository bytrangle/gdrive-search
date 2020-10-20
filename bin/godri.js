#! /usr/bin/env node

const CredentialManager = require('../lib/credentialManager');

async function main() {
  const creds = new CredentialManager('gogol');
  const [id, secret] = await creds.getIdAndSecret();
  console.log(id, secret);
}
main().catch(console.error);
