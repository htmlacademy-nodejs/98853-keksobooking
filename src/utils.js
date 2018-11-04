'use strict';

const REG_EXP_FOR_IMG = /\.(gif|jpg|jpeg|tiff|png)$/i;

const isImageName = (imgName) => REG_EXP_FOR_IMG.test(imgName);

const getRandomFromZero = (finiteNumber) => Math.floor(Math.random() * finiteNumber);

const getRandomFromArr = (array) => array[getRandomFromZero(array.length)];

const getRandomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomSample = (array) => {
  let result = [];
  let copy = array.slice();
  const randomLength = getRandomFromZero(array.length);
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = getRandomFromZero(copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1);
  }
  return result;
};

const mixArr = (array) => {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    let j = getRandomFromZero(i + 1);
    let temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
};

const getDateInInterval = (countOfDays) => {
  let today = Date.now();
  const past = new Date(today).setDate(new Date(today).getDate() - countOfDays);
  return getRandomFromRange(past, today);
};

const getRandomHash = (length) => Math.random().toString(36).slice(-length);

const isInteger = (num) => (num ^ 0) === num;

const getInvalidValue = (current, original) => {
  const array = Array.isArray(current) ? current : [current];
  return array.filter((it) => !original.includes(it));
};

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = {
  getRandomFromArr,
  getRandomFromRange,
  getRandomSample,
  mixArr,
  getDateInInterval,
  getRandomHash,
  isInteger,
  getInvalidValue,
  isImageName,
  asyncMiddleware
};
