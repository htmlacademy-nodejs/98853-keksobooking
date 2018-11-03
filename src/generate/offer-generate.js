'use strict';

const {
  getRandomFromArr,
  getRandomFromRange,
  getRandomSample,
  mixArr,
  getRandomHash,
  getDateInInterval
} = require(`../utils.js`);

const generatorOptions = require(`../data/generator-options.js`);


const getOfferStore = require(`../offers/store.js`);
const getImageStore = require(`../images/store.js`);
const offersRouter = require(`../offers/routes/main.js`);

const AVATAR_URL_BASE = `https://robohash.org`;
const LENGTH_OF_URL_HASH = 7;
const COUNT_OF_TEST_OFFERS = 50;


const getAvatarUrl = () => `${AVATAR_URL_BASE}/${getRandomHash(LENGTH_OF_URL_HASH)}.png`;

const getRandomLocation = () => ({
  'x': getRandomFromRange(generatorOptions.MIN_X, generatorOptions.MAX_X),
  'y': getRandomFromRange(generatorOptions.MIN_Y, generatorOptions.MAX_Y)
});


const generateEntity = () => ({
  author: {
    name: getRandomFromArr(generatorOptions.NAMES),
    avatar: getAvatarUrl()
  },
  offer: {
    title: getRandomFromArr(generatorOptions.TITLES),
    address: `540,472`,
    price: getRandomFromRange(generatorOptions.MIN_PRICE, generatorOptions.MAX_PRICE),
    type: getRandomFromArr(generatorOptions.TYPES),
    rooms: getRandomFromRange(generatorOptions.MIN_ROOMS_COUNT, generatorOptions.MAX_ROOMS_COUNT),
    guests: getRandomFromRange(generatorOptions.MIN_ROOMS_COUNT, generatorOptions.MAX_ROOMS_COUNT),
    checkin: getRandomFromArr(generatorOptions.CHECKINS),
    checkout: getRandomFromArr(generatorOptions.CHECKOUTS),
    features: getRandomSample(generatorOptions.FEATURES),
    description: ``,
    photos: mixArr(generatorOptions.PHOTOS)
  },
  location: {
    x: getRandomLocation().x,
    y: getRandomLocation().y
  },
  date: getDateInInterval(generatorOptions.TIME_INTERVAL_LENGTH)
});

const getOffers = (count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const offer = generateEntity();
    result.push(offer);
  }
  return result;
};

const fillDataBase = async () => {
  const testOffers = getOffers(COUNT_OF_TEST_OFFERS);
  const offerStore = getOfferStore();
  const imageStore = getImageStore();
  await offersRouter(offerStore, imageStore).offerStore.saveMany(testOffers);
  console.log(`Тестовые данные успешно загруженны в базу данных!`);
};

module.exports = {
  generateEntity,
  getOffers,
  fillDataBase
};
