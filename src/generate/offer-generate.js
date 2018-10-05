'use strict';

const {getRandomFromArr, getRandomFromRange, getRandomSample, mixArr} = require(`../utils.js`);
const generatorOptions = require(`../data/generator-options.js`);

const AVATAR_URL_BASE = `https://robohash.org`;

const avatarUrl = `${AVATAR_URL_BASE}/${Math.random().toString(36).slice(-5)}`;

const location = {
  'x': getRandomFromRange(generatorOptions.MIN_X, generatorOptions.MAX_X),
  'y': getRandomFromRange(generatorOptions.MIN_Y, generatorOptions.MAX_Y)
};

const getDateInInterval = (length) => {
  let today = Date.now();
  const past = new Date(today).setDate(new Date(today).getDate() - length);
  return getRandomFromRange(past, today);
};

const generateEntity = () => {
  return {
    author: {
      avatar: avatarUrl
    },
    offer: {
      title: getRandomFromArr(generatorOptions.TITLES),
      address: `${location.x}, ${location.y}`,
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
      x: location.x,
      y: location.y
    },
    date: getDateInInterval(generatorOptions.TIME_INTERVAL_LENGTH)
  };
};

module.exports = {
  generateEntity
};
