'use strict';

const readline = require(`readline`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const {getOffers} = require(`./offer-generate.js`);
const {isInteger} = require(`../utils.js`);
const MAX_OF_ELEMENTS_GENERATED = 10;
const MIN_OF_ELEMENTS_GENERATED = 1;
const positiveAnswer = `да`;
const negativeAnswer = `нет`;

const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askUser = (question) => {
  return new Promise((resolve) => {
    rl.question(`${question} \n`, resolve);
  });
};


const confirmGeneration = async () => {
  const question = `Вы хотите сгенерировать данные? (да/нет)`;
  let answer = await askUser(question);
  while (answer !== positiveAnswer && answer !== negativeAnswer) {
    answer = await askUser(question);
  }
  return answer === positiveAnswer;
};

const getItemsCount = async () => {
  const question = `Сколько объектов Вы хотите сгенерировать? \n Мин: ${MIN_OF_ELEMENTS_GENERATED}, Макс: ${MAX_OF_ELEMENTS_GENERATED}`;
  let answer = await askUser(question);
  while (answer < MIN_OF_ELEMENTS_GENERATED || answer > MAX_OF_ELEMENTS_GENERATED || !isInteger(+answer)) {
    answer = await askUser(question);
  }
  return answer;
};

const getFilePath = async () => {
  const question = `Куда Вы хотите сохранить данные?`;
  let answer = await askUser(question);
  while (!answer) {
    answer = await askUser(question);
  }
  return `${__dirname}/${answer}`;
};

const checkExistance = (path) => {
  return new Promise((resolve) => {
    fs.access(path, fs.F_OK, (error) => {
      resolve(!error);
    });
  });
};

const confirmRewrite = async () => {
  const question = `Такой файл существует, хотите перезаписать его? (да/нет)`;
  let answer = await askUser(question);
  while (answer !== positiveAnswer && answer !== negativeAnswer) {
    answer = await askUser(question);
  }
  return answer === positiveAnswer;
};


const saveItemsToFile = async (filePath, itemCount) => {
  const data = await getOffers(itemCount);
  const writeFile = promisify(fs.writeFile);
  await writeFile(filePath, JSON.stringify(data), fileWriteOptions);
  console.log(`Данные сохранены в ${filePath}`);
};


const executeGeneration = async () => {
  try {
    const isReadyToGenerate = await confirmGeneration();
    if (isReadyToGenerate) {
      const itemsCount = await getItemsCount();
      const filePath = await getFilePath();
      const isFileAlreadyExists = await checkExistance(filePath);

      if (isFileAlreadyExists) {
        const isReadyToRewrite = await confirmRewrite();
        if (!isReadyToRewrite) {
          console.log(`Данные не были сохранены!`);
          process.exit(1);
        }
      }

      await saveItemsToFile(filePath, itemsCount);
      rl.close();
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
  rl.close();
};

module.exports = {
  executeGeneration
};

