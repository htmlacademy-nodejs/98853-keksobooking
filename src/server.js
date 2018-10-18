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


// eslint-disable-next-line no-unused-vars
const ERROR_HANDLER = (err, req, res, next) => {
  debugger;
  if (err) {
    console.error(err);
    console.log(res);
    res.status(err.code || 500).send(err.message);
  }
};

app.use(ERROR_HANDLER);


const startServer = (port = DEFAULT_PORT) => {
  app.listen(port, () => console.log(`Server starting... Go to http://${HOSTNAME}:${port}`));
};


module.exports = {
  startServer
};
