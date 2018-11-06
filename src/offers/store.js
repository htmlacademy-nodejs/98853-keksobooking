'use strict';

const startDatabase = require(`../database/db`);
const logger = require(`../logger`);

const setupCollection = async () => {
  const dBase = await startDatabase();
  const collection = dBase.collection(`offers`);
  collection.createIndex({date: -1});
  return collection;
};

class OffersStore {
  constructor(collection) {
    this._collection = collection;
  }

  async getOffer(date) {
    return (await this._collection).findOne({date: Number(date)});
  }

  async getAllOffers() {
    return (await this._collection).find({}, {projection: {_id: 0}});
  }

  async saveOne(offerData) {
    return (await this._collection).insertOne(offerData);
  }

  async saveMany(offersData) {
    return (await this._collection).insertMany(offersData);
  }

}

module.exports = () => new OffersStore(setupCollection().
  catch((e) => logger.error(`Failed to set up "offers"-collection`, e)));
