'use strict';

const {
  getRandomFromArr,
  getRandomFromRange,
  getRandomSample,
  mixArr,
  getRandomHash,
  getDateInInterval
} = require(`../utils.js`);

const {GeneratorOptions} = require(`../data/generator-options.js`);

const AVATAR_URL_BASE = `https://robohash.org`;
const LENGTH_OF_URL_HASH = 7;


const getAvatarUrl = () => `${AVATAR_URL_BASE}/${getRandomHash(LENGTH_OF_URL_HASH)}.png`;

const getRandomLocation = () => ({
  'x': getRandomFromRange(GeneratorOptions.MIN_X, GeneratorOptions.MAX_X),
  'y': getRandomFromRange(GeneratorOptions.MIN_Y, GeneratorOptions.MAX_Y)
});


const generateEntity = () => ({
  author: {
    name: getRandomFromArr(GeneratorOptions.NAMES),
    avatar: getAvatarUrl()
  },
  offer: {
    title: getRandomFromArr(GeneratorOptions.TITLES),
    address: `540,472`,
    price: getRandomFromRange(GeneratorOptions.MIN_PRICE, GeneratorOptions.MAX_PRICE),
    type: getRandomFromArr(GeneratorOptions.TYPES),
    rooms: getRandomFromRange(GeneratorOptions.MIN_ROOMS_COUNT, GeneratorOptions.MAX_ROOMS_COUNT),
    guests: getRandomFromRange(GeneratorOptions.MIN_ROOMS_COUNT, GeneratorOptions.MAX_ROOMS_COUNT),
    checkin: getRandomFromArr(GeneratorOptions.CHECKINS),
    checkout: getRandomFromArr(GeneratorOptions.CHECKOUTS),
    features: getRandomSample(GeneratorOptions.FEATURES),
    description: ``,
    photos: mixArr(GeneratorOptions.PHOTOS)
  },
  location: {
    x: getRandomLocation().x,
    y: getRandomLocation().y
  },
  date: getDateInInterval(GeneratorOptions.TIME_INTERVAL_LENGTH)
});

const getOffers = (count) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const offer = generateEntity();
    result.push(offer);
  }
  return result;
};

module.exports = {
  generateEntity,
  getOffers
};
