'use strict';
const {startServer} = require(`./../server.js`);

module.exports = {
  name: `server`,
  description: `Запускает сервер`,
  execute() {
    const port = process.argv[3];
    startServer(port);
  }
};
