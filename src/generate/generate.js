'use strict';

const readline = require(`readline`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const {getOffers} = require(`./offer-generate.js`);
const {isInteger} = require(`../utils.js`);
const MAX_OF_ELEMENTS_GENERATED = 10;
const MIN_OF_ELEMENTS_GENERATED = 1;
const VALIDATION_FUNCTIONS = {
  isItYesOrNo: (answer) => {
    return answer === POSITIVE_ANSWER || answer === NEGATIVE_ANSWER;
  },
  isItIntegerInRange: (answer) => {
    return answer >= MIN_OF_ELEMENTS_GENERATED && answer <= MAX_OF_ELEMENTS_GENERATED && isInteger(Number(answer));
  },
  isPathNotEmpty: (answer) => {
    return answer;
  }
};
const POSITIVE_ANSWER = `да`;
const NEGATIVE_ANSWER = `нет`;
const FILE_WRITE_OPTIONS = {encoding: `utf-8`, mode: 0o644};

const writeFile = promisify(fs.writeFile);
const open = promisify(fs.open);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askUser = async (question, validationFn) => {
  let currentQuestion;
  let answer;

  const askQuestionAndGetAnswer = async () => {
    currentQuestion = new Promise((resolve) => {
      rl.question(`${question} \n`, resolve);
    });
    answer = await currentQuestion;
  };
  while (!validationFn(answer)) {
    await askQuestionAndGetAnswer();
  }
  return currentQuestion;
};


const confirmGeneration = async () => {
  const question = `Вы хотите сгенерировать данные? (да/нет)`;
  const answer = await askUser(question, VALIDATION_FUNCTIONS.isItYesOrNo);
  return answer === POSITIVE_ANSWER;
};

const getItemsCount = async () => {
  const question = `Сколько объектов Вы хотите сгенерировать? \n Мин: ${MIN_OF_ELEMENTS_GENERATED}, Макс: ${MAX_OF_ELEMENTS_GENERATED}`;
  const answer = await askUser(question, VALIDATION_FUNCTIONS.isItIntegerInRange);
  return answer;
};

const getFilePath = async () => {
  const question = `Куда Вы хотите сохранить данные?`;
  const answer = await askUser(question, VALIDATION_FUNCTIONS.isPathNotEmpty);
  return `${__dirname}/${answer}`;
};

const confirmRewrite = async () => {
  const question = `Такой файл существует, хотите перезаписать его? (да/нет)`;
  const answer = await askUser(question, VALIDATION_FUNCTIONS.isItYesOrNo);
  return answer === POSITIVE_ANSWER;
};

const saveItemsToFile = async (filePath, itemCount) => {
  const data = getOffers(itemCount);
  try {
    await open(filePath, `w`);
  } catch (error) {
    if (error.code === `EEXIST`) {
      const isReadyToWrite = await confirmRewrite();
      if (!isReadyToWrite) {
        console.log(`Пользователь запретил перезапись!`);
        return;
      }
    }
  }
  await writeFile(filePath, JSON.stringify(data), FILE_WRITE_OPTIONS);
  console.log(`Данные сохранены в ${filePath}`);
};

const executeGeneration = async () => {
  try {
    const isReadyToGenerate = await confirmGeneration();
    if (isReadyToGenerate) {
      const itemsCount = await getItemsCount();
      const filePath = await getFilePath();
      await saveItemsToFile(filePath, itemsCount);
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

