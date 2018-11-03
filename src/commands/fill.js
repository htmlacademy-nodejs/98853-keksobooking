'use strict';

const {fillDataBase} = require(`../generate/offer-generate.js`);

module.exports = {
  name: `fill`,
  description: `Заполняет базу данных тестовыми данными`,
  execute() {
    fillDataBase();
  }
};
