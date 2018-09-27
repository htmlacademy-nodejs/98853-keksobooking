
const VERSION = `0.0.1`;
const AUTHOR = `Rinat Sadykov`;
const PROJECT_NAME = `nodejs-intensive`;

const command = process.argv[2];

const showAllComands = () => {
  Object.entries(commandActions).forEach(elem => {
    console.log(`${elem[0]} - ${elem[1].description}`);
  })
}

const showVersion = () => console.log(VERSION);

const commandActions = {
  '--version': {
    action: showVersion,
    description: 'печатает этот текст'
  },
  '--help': {
    action: showAllComands,
    description: 'печатает версию приложения'
  }
};

const isCommandAvailable = Object.keys(commandActions).indexOf(command) > -1;

if (isCommandAvailable) {
  commandActions[command].action();
} else if (!command) {
  console.log(`Привет пользователь!Эта программа будет запускать сервер ${PROJECT_NAME}.
    Автор: ${AUTHOR}.`);
} else {
  console.error(`Неизвестная команда ${command}.Чтобы прочитать правила использования приложения, наберите "--help"`);
  process.exit(1);
}



