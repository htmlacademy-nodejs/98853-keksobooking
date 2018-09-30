'use strict';

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `description`,
  description: `Показывает описание проекта`,
  execute() {
    console.log(`${packageInfo.description}`);
  }
};
