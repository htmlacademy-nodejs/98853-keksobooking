'use strict';

const db = require(`../database/db`);

const setupCollection = async () => {
  const dBase = await db;

  const collection = dBase.collection(`offers`);
  collection.createIndex({title: 1});
  return collection;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffer(title) {
    return (await this.collection).findOne({title});
  }

  async getAllOffers() {
    return (await this.collection).find();
  }

  async save(offerData) {
    return (await this.collection).insertOne(offerData);
  }

}

module.exports = new OffersStore(setupCollection().
  catch((e) => console.error(`Failed to set up "offers"-collection`, e)));
