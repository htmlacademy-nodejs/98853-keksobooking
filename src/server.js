'use strict';

const express = require(`express`);
const app = express();
const {offersRouter} = require(`./offers/route.js`);
const {join} = require(`path`);
const DEFAULT_PORT = 3000;
const HOSTNAME = `localhost`;
const DIR_NAME_WITH_STATIC = `static`;
const basePath = join(__dirname, `..`, DIR_NAME_WITH_STATIC);

app.use(express.static(basePath));

app.use(`/api/offers`, offersRouter);

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

// eslint-disable-next-line no-unused-vars
const ERROR_HANDLER = (err, req, res, next) => {
  if (err) {
    const acceptElements = req.headers.accept.split(`,`);
    const isJSONSupported = acceptElements.includes(`application/json`);
    const contentType = isJSONSupported ? `application/json; charset=UTF-8` : `text/html; charset=UTF-8`;
    res.setHeader(`Content-Type`, contentType);
    console.error(err);
    res.status(err.code || 500).send(isJSONSupported ? generateJSONError(err) : generateStringError(err));
  }
};

app.use(NOT_FOUND_HANDLER);

app.use(ERROR_HANDLER);

const startServer = (port = DEFAULT_PORT) => {
  return app.listen(port, () => console.log(`Server starting... Go to http://${HOSTNAME}:${port}`));
};

module.exports = {
  startServer,
  app
};
