'use strict';

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `author`,
  description: `Печатает автора приложения`,
  execute() {
    console.log(`${packageInfo.author}`);
  }
};
