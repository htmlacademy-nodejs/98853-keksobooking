'use strict';

const AVATAR_URL_BASE = `https://robohash.org`;
const store = {
  FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  TITLES: [`Большая уютная квартира`,
    `Маленькая неуютная квартира`,
    `Огромный прекрасный дворец`,
    `Маленький ужасный дворец`,
    `Красивый гостевой домик`,
    `Некрасивый негостеприимный домик`,
    `Уютное бунгало далеко от моря`,
    `Неуютное бунгало по колено в воде`
  ],
  MIN_PRICE: 1000,
  MAX_PRICE: 100000,
  MIN_ROOMS_COUNT: 1,
  MAX_ROOMS_COUNT: 5,
  TYPES: [`flat`, `palace`, `house`, `bungalo`],
  CHECKINS: [`12:00`, `13:00`, `14:00`],
  CHECKOUTS: [`12:00`, `13:00`, `14:00`],
  PHOTOS: [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
    `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
  ],
  MIN_X: 300,
  MAX_X: 900,
  MIN_Y: 150,
  MAX_Y: 500,
  TIME_INTERVAL_LENGTH: 7
};

const getRandomFromArr = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const avatarUrl = `${AVATAR_URL_BASE}/${Math.random().toString(36).slice(-5)}`;

const getRandomFeatures = (features) => {
  let result = [];
  let copy = features.slice();
  const randomLength = Math.floor(Math.random() * features.length);
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1);
  }
  return result;
};

const mixArr = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const location = {
  'x': getRandomFromRange(store.MIN_X, store.MAX_X),
  'y': getRandomFromRange(store.MIN_Y, store.MAX_Y)
};

const getDateInInterval = (length) => {
  let today = +new Date();
  const past = new Date(today).setDate(new Date(today).getDate() - length);
  return getRandomFromRange(past, today);
};

const generateEntity = () => {
  return {
    'author': {
      'avatar': avatarUrl
    },
    'offer': {
      'title': getRandomFromArr(store.TITLES),
      'address': `${location.x}, ${location.y}`,
      'price': getRandomFromRange(store.MIN_PRICE, store.MAX_PRICE),
      'type': getRandomFromArr(store.TYPES),
      'rooms': getRandomFromRange(store.MIN_ROOMS_COUNT, store.MAX_ROOMS_COUNT),
      'guests': getRandomFromRange(store.MIN_ROOMS_COUNT, store.MAX_ROOMS_COUNT),
      'checkin': getRandomFromArr(store.CHECKINS),
      'checkout': getRandomFromArr(store.CHECKOUTS),
      'features': getRandomFeatures(store.FEATURES),
      'description': ``,
      'photos': mixArr(store.PHOTOS)
    },
    'location': {
      'x': location.x,
      'y': location.y
    },
    'date': getDateInInterval(store.TIME_INTERVAL_LENGTH)
  };
};

module.exports = {
  generateEntity
};
