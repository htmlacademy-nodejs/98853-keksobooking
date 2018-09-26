
const VERSION = `0.0.1`;
const AUTHOR = `Rinat Sadykov`;
const PROJECT_NAME = `nodejs-intensive`;

const command = process.argv[2];

const showAllComands = () => {
  Object.keys(commandActions).forEach(elem => {
    console.log(elem);
  })
}

const showVersion = () => console.log(VERSION);

const commandActions = {
  '--version': showVersion,
  '--help': showAllComands
};

const isAvaliableCommands = Object.keys(commandActions).indexOf(command) > -1 ? true : false;

if (isAvaliableCommands) {
  commandActions[command]();
  process.exit(0);
} else if (!command) {
  console.log(`Привет пользователь!Эта программа будет запускать сервер ${PROJECT_NAME}.
    Автор: ${AUTHOR}.`);
  process.exit(0);
} else {
  console.error(`Неизвестная команда ${command}.Чтобы прочитать правила использования приложения, наберите "--help"`);
  process.exit(1);
}



