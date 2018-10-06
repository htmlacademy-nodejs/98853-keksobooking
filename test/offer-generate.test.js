'use strict';

const assert = require(`assert`);
const {generateEntity} = require(`../src/generate/offer-generate.js`);
const generatorOptions = require(`../src/data/generator-options.js`);

const ONE_WEEK_INTERVAL_MS = generatorOptions.TIME_INTERVAL_LENGTH * 24 * 60 * 60 * 1000;

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

  it(`Avatar's url is a URL`, () => {
    assert.equal(true, /^(ftp|http|https):\/\/[^ "]+$/.test(data.author.avatar));
  });

  it(`Price is a number`, () => {
    assert.equal(`number`, typeof data.offer.price);
  });

  it(`Price > 1000 and < 1000000`, () => {
    assert.equal(true, data.offer.price > generatorOptions.MIN_PRICE);
    assert.equal(true, data.offer.price < generatorOptions.MAX_PRICE);
  });

  it(`Type is a string`, () => {
    assert.equal(`string`, typeof data.offer.type);
  });

  it(`Type equal flat, palace, house or bungalo`, () => {
    assert.notEqual(-1, generatorOptions.TYPES.indexOf(data.offer.type));
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

  it(`Array of photos has a random sequence`, () => {
    assert.notEqual(JSON.stringify(data.offer.photos), JSON.stringify(generateEntity().offer.photos));
  });

  it(`Date is a number`, () => {
    assert.notEqual(data.date, generateEntity().date);
    assert.equal(`number`, typeof data.date);
  });

  it(`The difference between today and the date of placement is not more than 7 days`, () => {
    assert.equal(true, (Date.now() - generateEntity().date) < ONE_WEEK_INTERVAL_MS);
  });

  it(`Rooms is a number`, () => {
    assert.equal(`number`, typeof data.offer.rooms);
  });

  it(`Count of rooms >= 1 and <= 5`, () => {
    assert.equal(true, data.offer.rooms >= generatorOptions.MIN_ROOMS_COUNT);
    assert.equal(true, data.offer.rooms <= generatorOptions.MAX_ROOMS_COUNT);
  });

  it(`Guests is a number`, () => {
    assert.equal(`number`, typeof data.offer.guests);
  });

  it(`Count of guests >= 1 and <= 5`, () => {
    assert.equal(true, data.offer.guests >= generatorOptions.MIN_ROOMS_COUNT);
    assert.equal(true, data.offer.guests <= generatorOptions.MAX_ROOMS_COUNT);
  });

  it(`Checkin is a string`, () => {
    assert.equal(`string`, typeof data.offer.checkin);
  });

  it(`Checkin equal 12:00, 13:00 or 14:00`, () => {
    assert.notEqual(-1, generatorOptions.CHECKINS.indexOf(data.offer.checkin));
  });

  it(`Checkout is a string`, () => {
    assert.equal(`string`, typeof data.offer.checkout);
  });

  it(`Checkout equal 12:00, 13:00 or 14:00`, () => {
    assert.notEqual(-1, generatorOptions.CHECKOUTS.indexOf(data.offer.checkout));
  });

  it(`Location.x and location.y is a numbers`, () => {
    assert.equal(`number`, typeof data.location.x);
    assert.equal(`number`, typeof data.location.y);
  });

  it(`Location.x is a random number > 300 and < 900`, () => {
    assert.equal(true, data.location.x >= generatorOptions.MIN_X);
    assert.equal(true, data.location.x <= generatorOptions.MAX_X);
  });

  it(`Location.y is a random number > 150 and < 500`, () => {
    assert.equal(true, data.location.y >= generatorOptions.MIN_Y);
    assert.equal(true, data.location.y <= generatorOptions.MAX_Y);
  });

});
