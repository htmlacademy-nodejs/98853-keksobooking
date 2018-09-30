'use strict';

const {description} = require(`../../package.json`);

module.exports = {
  name: `description`,
  description: `Показывает описание проекта`,
  execute() {
    console.log(`${description}`);
  }
};
