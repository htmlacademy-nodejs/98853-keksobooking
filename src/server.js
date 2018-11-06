'use strict';

const express = require(`express`);
const app = express();
const logger = require(`./logger`);

const getoffersStore = require(`./offers/store.js`);
const getImagesStore = require(`./images/store.js`);
const offersRouter = require(`./offers/routes/main.js`);

const DEFAULT_PORT = 3000;
const DEFAULT_HOST = `localhost`;
const DIR_NAME_WITH_STATIC = `static`;

const {SERVER_PORT = DEFAULT_PORT, SERVER_HOST = DEFAULT_HOST} = process.env;

const basePath = require(`path`).join(__dirname, `..`, DIR_NAME_WITH_STATIC);


const generateJSONError = ({name: error, message: errorMessage}) => {
  const errorObj = {
    error,
    errorMessage
  };
  const errorBody = error === `Validation Error` ? errorMessage : errorObj;
  return JSON.stringify(errorBody);
};

const generateStringError = (err) => `${err.code} ${err.name} ${err.message}`;


const NOT_FOUND_HANDLER = (req, res) => {
  res.status(404).send(`Такой страницы не существует!`);
};

const ERROR_HANDLER = (err, req, res, _next) => {
  if (err) {
    const acceptElements = req.headers.accept.split(`,`);
    const isJSONSupported = acceptElements.includes(`application/json`);
    const contentType = isJSONSupported ? `application/json; charset=UTF-8` : `text/html; charset=UTF-8`;
    res.setHeader(`Content-Type`, contentType);
    logger.error(err);
    res.status(err.code || 500).send(isJSONSupported ? generateJSONError(err) : generateStringError(err));
  }
};

const ALLOW_CORS = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requested-With, Content-Type, Accept`);
  next();
};

app.use(express.static(basePath));
app.use(ALLOW_CORS);

const startServer = (port = DEFAULT_PORT) => {
  const offersStore = getoffersStore();
  const imagesStore = getImagesStore();
  app.use(`/api/offers`, offersRouter(offersStore, imagesStore));
  app.use(NOT_FOUND_HANDLER);
  app.use(ERROR_HANDLER);
  app.listen(port, () => console.log(`Server starting... Go to http://${SERVER_HOST}:${SERVER_PORT}`));
};

module.exports = {
  startServer,
  ERROR_HANDLER,
  NOT_FOUND_HANDLER
};
