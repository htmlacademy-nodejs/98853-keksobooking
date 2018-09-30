'use strict';

const {version} = require(`../../package.json`);

module.exports = {
  name: `version`,
  description: `Печатает версию приложения`,
  execute() {
    console.log(`v${version}`);
  }
};
