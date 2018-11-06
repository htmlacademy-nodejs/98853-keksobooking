'use strict';
const {Router} = require(`express`);
const defaultRoute = require(`./default`);
const dateRoute = require(`./date`);

// eslint-disable-next-line new-cap
const offersRouter = Router();

defaultRoute(offersRouter);
dateRoute(offersRouter);

module.exports = (offersStore, imagesStore) => {
  offersRouter.offersStore = offersStore;
  offersRouter.imagesStore = imagesStore;
  return offersRouter;
};
