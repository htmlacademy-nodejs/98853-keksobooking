'use strict';
const {startServer, startDataBase} = require(`./../server.js`);

module.exports = {
  name: `server`,
  description: `Запускает сервер`,
  execute() {
    const port = process.argv[3];
    console.log(startDataBase);
    startDataBase();
    startServer(port);
  }
};
