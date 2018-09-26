
const VERSION = `0.0.1`;

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
  console.log(`Привет пользователь!`);
  process.exit(0);
} else {
  console.error(`Неизвестная команда ${command}`);
  process.exit(1);
}



