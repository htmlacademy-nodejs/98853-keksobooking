'use strict';

const {author} = require(`../../package.json`);

module.exports = {
  name: `author`,
  description: `Печатает автора приложения`,
  execute() {
    console.log(`${author.yellow}`);
  }
};
