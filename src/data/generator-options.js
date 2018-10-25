'use strict';

const generatorOptions = {
  NAMES: [`Keks`,
    `Pavel`,
    `Nikolay`,
    `Alex`,
    `Ulyana`,
    `Anastasyia`,
    `Julia`],
  FEATURES: [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`],
  TITLES: [`Большая уютная квартира11111111111111`,
    `Маленькая неуютная квартира111111111111111111`,
    `Огромный прекрасный дворец11111111111111111`,
    `Маленький ужасный дворец111111111111111`,
    `Красивый гостевой домик111111111111111`,
    `Некрасивый негостеприимный домик111111111111111`,
    `Уютное бунгало далеко от моря11111111111111`,
    `Неуютное бунгало по колено в воде1111111111111111`
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
  TIME_INTERVAL_LENGTH: 20
};

module.exports = generatorOptions;
