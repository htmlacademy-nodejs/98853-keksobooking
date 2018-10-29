'use strict';

const Cursor = require(`./cursor-mock.js`);
const {getOffers} = require(`../../src/generate/offer-generate.js`);

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

  async save() {
    return {
      insertedId: 42
    };
  }

}

module.exports = new OfferStoreMock(getOffers(25));
