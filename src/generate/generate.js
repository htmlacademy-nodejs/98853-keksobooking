'use strict';

const readline = require(`readline`);
const fs = require(`fs`);
const {generateEntity} = require(`./offer-generate.js`);
const MAX_OF_ELEMENTS_GENERATED = 10;
const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};
const DEFAULT_PATH = `${process.cwd()}/offers.json`;

let rewritePath;
let count;

const generate = (path = DEFAULT_PATH) => {
  if (fs.existsSync(path)) {
    fs.unlink(path, (err) => console.log(err));
  }

  return new Promise((success, fail) => {
    for (let i = 0; i < count; i++) {
      const data = generateEntity();
      fs.appendFile(path, `${JSON.stringify(data)},\n`, fileWriteOptions, (err) => {
        if (err) {
          fail(err);
        }
      });
    }
    return success();
  });
};

const saveDatatoFile = (file) => {
  generate(file).then(() => {
    console.log(`Данные сохранены в файле ${file}`);
    rl.close();
  }).catch((err) => console.log(err));
};


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: `Введите ответ > `
});

const startDialog = () => rl.prompt();

const handleRewriteFileQuestion = (line) => {
  line = line.trim();

  switch (line) {
    case `да`:
      console.log(`Генерируем данные...`);
      saveDatatoFile(rewritePath);
      break;
    case `нет`:
      rl.close();
      return;
    default:
      console.log(`Введите да или нет`);
      startDialog();
      break;
  }

};

const handlePathToFileQuestion = (line) => {
  line = line.trim();
  rewritePath = `${__dirname}/${line}`;
  if (fs.existsSync(`${__dirname}/${line}`)) {

    console.log(`Такой файл уже существует. Хотите перезаписать его? (да/нет)`);
    rl.removeListener(`line`, handlePathToFileQuestion);
    startDialog();
    rl.on(`line`, handleRewriteFileQuestion);
  } else {
    console.log(`Генерируем данные...`);
    saveDatatoFile(rewritePath);
  }
};

const handleElementsQuestion = (line) => {
  line = line.trim();

  if (+line <= MAX_OF_ELEMENTS_GENERATED) {
    count = +line;
    console.log(`Укажите файл, куда вы хотите сохранить данные`);
    rl.removeListener(`line`, handleElementsQuestion);
    startDialog();
    rl.on(`line`, handlePathToFileQuestion);
  } else {
    console.log(`Введите количество генерируемых объектов. Максимальное количество - ${MAX_OF_ELEMENTS_GENERATED}`);
    startDialog();
  }

};

const handleGenerateQuestion = (line) => {
  line = line.trim();

  switch (line) {
    case `да`:
      console.log(`Сколько элементов Вы хотите сгенерировать?`);
      rl.removeListener(`line`, handleGenerateQuestion);
      startDialog();
      rl.on(`line`, handleElementsQuestion);
      break;
    case `нет`:
      rl.close();
      return;
    default:
      console.log(`Введите да или нет`);
      startDialog();
      break;
  }
};

rl.on(`line`, handleGenerateQuestion);

module.exports = {
  startDialog
};

