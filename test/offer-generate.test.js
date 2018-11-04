'use strict';

const assert = require(`assert`);
const {generateEntity} = require(`../src/generate/offer-generate.js`);
const {GeneratorOptions} = require(`../src/data/generator-options.js`);
const {isImageName} = require(`../src/utils.js`);
const ONE_WEEK_INTERVAL_MS = GeneratorOptions.TIME_INTERVAL_LENGTH * 24 * 60 * 60 * 1000;


let data;

describe(`Generate object with offer's options`, () => {

  before(() => {
    data = generateEntity();
  });

  it(`Function must return object`, () => {
    assert.equal(`object`, typeof data);
  });

  it(`Avatar's url is a string`, () => {
    assert.equal(`string`, typeof data.author.avatar);
  });

  it(`Avatar is a IMG`, () => {
    assert.equal(true, isImageName(data.author.avatar));
  });

  it(`Price is a number`, () => {
    assert.equal(`number`, typeof data.offer.price);
  });

  it(`Price > 1000 and < 1000000`, () => {
    assert.equal(true, data.offer.price > GeneratorOptions.MIN_PRICE);
    assert.equal(true, data.offer.price < GeneratorOptions.MAX_PRICE);
  });

  it(`Type is a string`, () => {
    assert.equal(`string`, typeof data.offer.type);
  });

  it(`Type equal flat, palace, house or bungalo`, () => {
    assert.notEqual(-1, GeneratorOptions.TYPES.indexOf(data.offer.type));
  });

  it(`Features is a array of the strings`, () => {
    assert.equal(true, Array.isArray(data.offer.features));
    assert.equal(true, data.offer.features.every((elem) => typeof elem === `string`));
  });

  it(`Features has a non-repeating content`, () => {
    assert.equal(data.offer.features.length, new Set(data.offer.features).size);
  });

  it(`Array of photos is a array of the strings`, () => {
    assert.equal(true, Array.isArray(data.offer.photos));
    assert.equal(true, data.offer.photos.every((elem) => typeof elem === `string`));
  });

  it(`Array of photos has a non-repeating content`, () => {
    assert.equal(data.offer.photos.length, new Set(data.offer.photos).size);

  });

  it(`Date is a number`, () => {
    // assert.notEqual(data.date, generateEntity().date);
    assert.equal(`number`, typeof data.date);
  });

  it(`The difference between today and the date of placement is not more than 7 days`, () => {
    assert.equal(true, (Date.now() - generateEntity().date) < ONE_WEEK_INTERVAL_MS);
  });

  it(`Rooms is a number`, () => {
    assert.equal(`number`, typeof data.offer.rooms);
  });

  it(`Count of rooms >= 1 and <= 5`, () => {
    assert.equal(true, data.offer.rooms >= GeneratorOptions.MIN_ROOMS_COUNT);
    assert.equal(true, data.offer.rooms <= GeneratorOptions.MAX_ROOMS_COUNT);
  });

  it(`Guests is a number`, () => {
    assert.equal(`number`, typeof data.offer.guests);
  });

  it(`Count of guests >= 1 and <= 5`, () => {
    assert.equal(true, data.offer.guests >= GeneratorOptions.MIN_ROOMS_COUNT);
    assert.equal(true, data.offer.guests <= GeneratorOptions.MAX_ROOMS_COUNT);
  });

  it(`Checkin is a string`, () => {
    assert.equal(`string`, typeof data.offer.checkin);
  });

  it(`Checkin equal 12:00, 13:00 or 14:00`, () => {
    assert.notEqual(-1, GeneratorOptions.CHECKINS.indexOf(data.offer.checkin));
  });

  it(`Checkout is a string`, () => {
    assert.equal(`string`, typeof data.offer.checkout);
  });

  it(`Checkout equal 12:00, 13:00 or 14:00`, () => {
    assert.notEqual(-1, GeneratorOptions.CHECKOUTS.indexOf(data.offer.checkout));
  });

  it(`Location.x and location.y is a numbers`, () => {
    assert.equal(`number`, typeof data.location.x);
    assert.equal(`number`, typeof data.location.y);
  });

  it(`Location.x is a random number > 300 and < 900`, () => {
    assert.equal(true, data.location.x >= GeneratorOptions.MIN_X);
    assert.equal(true, data.location.x <= GeneratorOptions.MAX_X);
  });

  it(`Location.y is a random number > 150 and < 500`, () => {
    assert.equal(true, data.location.y >= GeneratorOptions.MIN_Y);
    assert.equal(true, data.location.y <= GeneratorOptions.MAX_Y);
  });

});
