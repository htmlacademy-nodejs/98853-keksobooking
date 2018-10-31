'use strict';

const {MongoClient} = require(`mongodb`);

const URL = `mongodb://localhost:27017`;

const startDataBase = () => {
  return MongoClient.connect(URL, {useNewUrlParser: true}).then((client) => client.db(`keksobooking`)).catch((e) => {
    console.error(`Failed to connect to MongoDB`, e);
    process.exit(1);
  });
};

module.exports = {
  startDataBase
}
