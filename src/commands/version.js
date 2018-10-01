'use strict';

const {version} = require(`../../package.json`);
const [major, minor, patch] = version.split(`.`);

module.exports = {
  name: `version`,
  description: `Печатает версию приложения`,
  execute() {
    console.log(`v${major.red}.${minor.green}.${patch.blue}`);
  }
};
