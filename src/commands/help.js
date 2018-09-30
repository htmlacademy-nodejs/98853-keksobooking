'use strict';

module.exports = {
  name: `help`,
  description: `Показывает список доступных команд`,
  execute(commands) {
    commands.forEach((elem) => {
      console.log(`${elem.name} - ${elem.description}`);
    });
  }
};
