'use strict';
const getOffersStore = require(`../offers/store.js`);
const {getOffers} = require(`../generate/offer-generate.js`);
const logger = require(`../logger`);

const COUNT_OF_TEST_OFFERS = 50;

module.exports = {
  name: `fill`,
  description: `Заполняет базу данных тестовыми данными`,
  async execute() {
    const testOffers = getOffers(COUNT_OF_TEST_OFFERS);
    const offersStore = getOffersStore();
    try {
      await offersStore.saveMany(testOffers);
    } catch (error) {
      console.log(`Данные загрузить не удалось...`);
      logger.error(error);
      process.exit(1);
    }
    console.log(`Тестовые данные успешно загруженны в базу данных!`);
    process.exit(0);
  }
};
