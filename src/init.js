'use strict';

const packageInfo = require(`../package.json`);

const help = require(`./commands/help.js`);
const version = require(`./commands/version.js`);
const author = require(`./commands/author.js`);
const description = require(`./commands/description.js`);
const license = require(`./commands/license.js`);
const server = require(`./commands/server.js`);
const {executeGeneration} = require(`./generate/generate.js`);


const commands = [help, version, author, description, license, server];
const init = (command) => {
  if (command) {
    const match = commands.find((elem) => `--${elem.name}` === command);
    if (match) {
      match.execute();
    } else {
      console.log(`Неизвестная команда ${command}.Чтобы прочитать правила использования приложения, наберите "--help"`);
      process.exit(1);
    }
  } else {
    console.log(`Привет пользователь! Эта программа будет запускать сервер ${packageInfo.name}.
	  	\nАвтор: ${packageInfo.author}.`);
    executeGeneration();
  }
};

module.exports = init;

