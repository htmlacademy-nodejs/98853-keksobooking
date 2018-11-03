'use strict';
const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const DEFAULT_DB_HOST = `localhost:27017`;
const DEFAULT_DB_NAME = `keksobooking`;
const {DB_HOST = DEFAULT_DB_HOST, DB_NAME = DEFAULT_DB_NAME} = process.env;

const URL = `mongodb://${DB_HOST}`;

module.exports = () => MongoClient.connect(URL, {useNewUrlParser: true}).
then((client) => client.db(DB_NAME)).catch((e) => {
  logger.error(`Failed to connect to MongoDB`, e);
  process.exit(1);
});

