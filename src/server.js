'use strict';

const express = require(`express`);
const app = express();
const getOfferStore = require(`./offers/store.js`);
const getImageStore = require(`./images/store.js`);
const offersRouter = require(`./offers/route.js`);
const {join} = require(`path`);
const DEFAULT_PORT = 3000;
const HOSTNAME = `localhost`;
const DIR_NAME_WITH_STATIC = `static`;
const basePath = join(__dirname, `..`, DIR_NAME_WITH_STATIC);

app.use(express.static(basePath));


const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Такой страницы не существует!`);
};

const generateJSONError = ({name: error, message: errorMessage}) => {
  let errorObj = {
    error,
    errorMessage
  };
  const errorBody = error === `Validation Error` ? errorMessage : errorObj;
  return JSON.stringify(errorBody);
};

const generateStringError = (err) => `${err.code} ${err.name} ${err.message}`;

const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    const acceptElements = req.headers.accept.split(`,`);
    const isJSONSupported = acceptElements.includes(`application/json`);
    const contentType = isJSONSupported ? `application/json; charset=UTF-8` : `text/html; charset=UTF-8`;
    res.setHeader(`Content-Type`, contentType);
    console.error(err);
    res.status(err.code || 500).send(isJSONSupported ? generateJSONError(err) : generateStringError(err));
  }
};

const startServer = (port = DEFAULT_PORT) => {
  const offerStore = getOfferStore();
  const imageStore = getImageStore();
  app.use(`/api/offers`, offersRouter(offerStore, imageStore));
  app.use(NOT_FOUND_HANDLER);
  app.use(ERROR_HANDLER);
  app.listen(port, () => console.log(`Server starting... Go to http://${HOSTNAME}:${port}`));
  return app;
};

module.exports = {
  startServer,
  app,
  ERROR_HANDLER,
  NOT_FOUND_HANDLER
};
