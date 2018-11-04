'use strict';
const {Router} = require(`express`);
const defaultRoute = require(`./default`);
const dateRoute = require(`./date`);

// eslint-disable-next-line new-cap
const offersRouter = Router();

defaultRoute(offersRouter);
dateRoute(offersRouter);

module.exports = (offerStore, imageStore) => {
  offersRouter.offerStore = offerStore;
  offersRouter.imageStore = imageStore;
  return offersRouter;
};
