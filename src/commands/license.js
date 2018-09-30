'use strict';

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `license`,
  description: `Показывает тип лицензии`,
  execute() {
    console.log(`${packageInfo.license}`);
  }
};
