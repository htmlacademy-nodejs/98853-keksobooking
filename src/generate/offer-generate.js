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

const AVATAR_URL_BASE = `https://robohash.org`;
const LENGTH_OF_URL_HASH = 7;


const getAvatarUrl = () => `${AVATAR_URL_BASE}/${getRandomHash(LENGTH_OF_URL_HASH)}`;

const getRandomLocation = () => ({
  'x': getRandomFromRange(generatorOptions.MIN_X, generatorOptions.MAX_X),
  'y': getRandomFromRange(generatorOptions.MIN_Y, generatorOptions.MAX_Y)
});


const generateEntity = (count) => {
  const result = [];
  return new Promise((resolve) => {
    for (let i = 0; i < count; i++) {
      const offer = {
        author: {
          avatar: getAvatarUrl()
        },
        offer: {
          title: getRandomFromArr(generatorOptions.TITLES),
          address: ``,
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
      };
      result.push(offer);
    }
    resolve(result);
  });

};

module.exports = {
  generateEntity
};
