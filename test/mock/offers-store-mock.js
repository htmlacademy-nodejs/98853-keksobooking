'use strict';

const Cursor = require(`./cursor-mock.js`);
const {getOffers} = require(`../../src/generate/offer-generate.js`);
const CONST_DATE_FOR_TEST = 1541231052501;

class OfferStoreMock {
  constructor(data) {
    this.data = data;
  }

  async getOffer(date) {
    return this.data.find((it) => it.date === Number(date));
  }

  async getAllOffers() {
    return new Cursor(this.data);
  }

  async saveOne() {
    return {
      insertedId: 42
    };
  }

}

const offers = getOffers(50);
offers[0].date = CONST_DATE_FOR_TEST;

module.exports = new OfferStoreMock(offers);
