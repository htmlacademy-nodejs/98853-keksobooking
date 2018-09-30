'use strict';

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `version`,
  description: `Печатает версию приложения`,
  execute() {
    console.log(`v${packageInfo.version}`);
  }
};
