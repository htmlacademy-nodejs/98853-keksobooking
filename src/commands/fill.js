'use strict';
const getOfferStore = require(`../offers/store.js`);
const {getOffers} = require(`../generate/offer-generate.js`);

const COUNT_OF_TEST_OFFERS = 50;

module.exports = {
  name: `fill`,
  description: `Заполняет базу данных тестовыми данными`,
  async execute() {
    const testOffers = getOffers(COUNT_OF_TEST_OFFERS);
    const offerStore = getOfferStore();
    await offerStore.saveMany(testOffers);
    console.log(`Тестовые данные успешно загруженны в базу данных!`);
  }
};
