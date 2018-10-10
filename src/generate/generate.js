'use strict';

const readline = require(`readline`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const {generateEntity} = require(`./offer-generate.js`);
const MAX_OF_ELEMENTS_GENERATED = 10;
const fileWriteOptions = {encoding: `utf-8`, mode: 0o644};
const DEFAULT_PATH = `${process.cwd()}/offers.json`;


let rewritePath;
let count;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askUser = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}


const confirmGeneration = async () => {

  let answer = await askUser(`Вы хотите сгенерировать данные? (да/нет) \n`);

  while (answer != `да`) {
    answer = await askUser(`Вы хотите сгенерировать данные? (да/нет) \n`);
  }

  return true;


};

const getItemsCount = async () => {

  let answer = await askUser(`Сколько объектов Вы хотите сгенерировать? \n`);

  while (typeof +answer != `number`) {
    answer = await askUser(`Сколько объектов Вы хотите сгенерировать? \n`);
  }
  count = answer;
  return answer;


};

const getFilePath = async () => {

  let path = await askUser(`Куда Вы хотите сохранить файл? \n`);

  return `${__dirname}/${path}`;


};

const checkExistance = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.F_OK, error => {
      resolve(!error);
    });
  });
}

const confirmRewrite = async () => {
  let answer = await askUser(`Такой файл существует, хотите перезаписать его? (да/нет) \n`);

  while (answer != `да`) {
    answer = await askUser(`Введите да или нет \n`);
  }

  return true;
}

const removeFile = async (path) => {
  const unlink = await promisify(fs.unlink);
  unlink(path);
}

const saveItemsToFile = async (filePath) => {
  const data = await generateEntity(count);
  const writeFile = await promisify(fs.writeFile);
  writeFile(filePath, JSON.stringify(data), fileWriteOptions);
}




async function execute() {
    try {
        const isReadyToGenerate = await confirmGeneration();
        if (isReadyToGenerate) {
          const itemsCount = await getItemsCount();
          const filePath = await getFilePath();
          const isFileAlreadyExists = await checkExistance(filePath);
          console.log(isFileAlreadyExists);

          if (isFileAlreadyExists) {
            const isReadyToRewrite = await confirmRewrite();
            console.log(isReadyToRewrite);
            if (!isReadyToRewrite) {
                return;
            }

            await removeFile(filePath);
          }

          await saveItemsToFile(filePath);
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}




/*const getItemsCount = () => count;
const getFilePath = () => rewritePath;
const checkExistance = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.F_OK, error => {
      resolve(!error);
    });
  });
}


const saveItemsToFile = (path) => {
  return new Promise((resolve, reject) => {
    const data = generateEntity(count);
    fs.writeFile(path, JSON.stringify(data), fileWriteOptions, (err) => console.log(err));
    resolve();
  })
}


const generate = async (path) => {
  try {
    await saveItemsToFile(path);
    console.log(`Данные сохранены в файле ${path}`);
    rl.close();
  } catch (error) {
    console.error(error);
    process.exit(1);
    }
}*/









/*const handleRewriteFileQuestion = (answer) => {
  const action = (answer) => {
    switch (answer) {
      case `да`:
        console.log(`Генерируем данные...`);
        return true;
      case `нет`:
        rl.close();
      default:
        console.log(`Вы ввели неверное значение! Введите да или нет!`);
        rl.close();
        break;
    }
  };
  askUser(`Такой файл уже существует. Хотите перезаписать его?\n`).then((answer) => action(answer)).catch((err) => console.log(err));

};

const handlePathToFileQuestion = () => {
  const action = async (answer) => {
    rewritePath = `${__dirname}/${answer}`;
    const isFileExist = await checkExistance(rewritePath);
    if (isFileExist) {
      handleRewriteFileQuestion(rewritePath);
    } else {
      generate(rewritePath);
    }
  }
  askUser(`Укажите файл, куда нужно сохранить данные\n`).then((answer) => action(answer)).catch((err) => console.log(err));
};


const handleElementsQuestion = () => {
  const action = (answer) => {
    if (+answer <= MAX_OF_ELEMENTS_GENERATED) {
      count = +answer;
      handlePathToFileQuestion();
    } else {
      console.log(`Введите количество генерируемых объектов. Максимальное количество - ${MAX_OF_ELEMENTS_GENERATED}`);
      rl.close();
    }
  }
  askUser(`Сколько элементов Вы хотите сгенерировать?\n`).then((answer) => action(answer)).catch((err) => console.log(err));
};

const handleGenerateQuestion = () => {
  const action = (answer) => {
    switch (answer) {
      case `да`:
        handleElementsQuestion();
        break;
      case `нет`:
        rl.close();
        return;
      default:
        console.log(`Вы ввели неверное значение! Введите да или нет!`);
        rl.close();
        break;
    }
  }
  askUser(`Вы хотите сгенерировать данные? (да/нет) \n`).then((answer) => action(answer)).catch((err) => console.log(err));
};

*/


module.exports = {
  execute
};

