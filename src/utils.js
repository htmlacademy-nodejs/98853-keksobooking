'use strict';

const getRandomFromZero = (array) => Math.floor(Math.random() * array.length);

const getRandomFromArr = (array) => array[getRandomFromZero(array)];

const getRandomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomSample = (array) => {
  let result = [];
  let copy = array.slice();
  const randomLength = getRandomFromZero(array);
  for (let i = 0; i < randomLength; i++) {
    const randomIndex = getRandomFromZero(copy);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1);
  }
  return result;
};

const mixArr = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

module.exports = {
  getRandomFromArr,
  getRandomFromRange,
  getRandomSample,
  mixArr
};
