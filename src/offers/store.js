'use strict';

const startDataBase = require(`../database/db`);
const logger = require(`../logger`);

const setupCollection = async () => {
  const dBase = await startDataBase();
  const collection = dBase.collection(`offers`);
  collection.createIndex({date: -1});
  return collection;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffer(date) {
    return (await this.collection).findOne({date: Number(date)});
  }

  async getAllOffers() {
    return (await this.collection).find();
  }

  async saveOne(offerData) {
    return (await this.collection).insertOne(offerData);
  }

  async saveMany(offersData) {
    return (await this.collection).insertMany(offersData);
  }

}

module.exports = () => new OffersStore(setupCollection().
  catch((e) => logger.error(`Failed to set up "offers"-collection`, e)));
