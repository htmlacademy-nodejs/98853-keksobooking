'use strict';

const {version} = require(`../../package.json`);

module.exports = {
  name: `version`,
  description: `Печатает версию приложения`,
  execute() {
    console.log(`v${version[0].red}.${version[2].green}.${version[4].blue}`);
  }
};
