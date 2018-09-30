'use strict';

const packageInfo = require(`../package.json`);

const help = require(`./commands/help.js`);
const version = require(`./commands/version.js`);
const author = require(`./commands/author.js`);
const description = require(`./commands/description.js`);
const license = require(`./commands/license.js`);

const commands = [help, version, author, description, license];
const init = (command) => {
  const isCommandAvailable = commands.some((elem) => `--${elem.name}` === command);
  if (isCommandAvailable) {
    commands.find((elem) => `--${elem.name}` === command).execute();
  } else if (!command) {
    console.log(`Привет пользователь! Эта программа будет запускать сервер ${packageInfo.name}.
	  	\nАвтор: ${packageInfo.author}.`);
  } else {
    console.log(`Неизвестная команда ${command}.
    	\nЧтобы прочитать правила использования приложения, наберите "--help"`);
    process.exit(1);
  }
};

module.exports = init;

