'use strict';

const assert = require(`assert`);
const {generateEntity} = require(`../src/generate/offer-generate.js`);

let data;

describe(`Generate object with offer's options`, () => {

  beforeEach(() => {
    data = generateEntity();
  });

  it(`Function must return object`, () => {
    assert.equal(`object`, typeof data);
  });

  it(`Avatar's url is a string`, () => {
    assert.equal(`string`, typeof data.author.avatar);
  });

  it(`Price > 1000 and < 1000000`, () => {
    assert.equal(true, data.offer.price > 1000);
    assert.equal(true, data.offer.price < 1000000);
  });

  it(`Type is a string`, () => {
    assert.equal(`string`, typeof data.offer.type);
  });

  it(`Type equal flat, palace, house or bungalo`, () => {
    assert.equal(true, data.offer.type === `flat` || data.offer.type === `palace` || data.offer.type === `house` || data.offer.type === `bungalo`);
  });

  it(`Features has a non-repeating content`, () => {
    assert.notDeepEqual(data.offer.features, generateEntity().offer.features);
  });

  it(`Array of photos has a random sequence`, () => {
    assert.notDeepEqual(data.offer.photos[0], generateEntity().offer.photos[0]);
  });

  it(`Date is a random number`, () => {
    assert.notEqual(data.date, generateEntity().date);
    assert.equal(`number`, typeof data.date);
  });

  it(`The difference between today and the date of placement is not more than 7 days`, () => {
    assert.equal(true, (+new Date() - generateEntity().date) < 7 * 24 * 60 * 60 * 1000);
  });
});
