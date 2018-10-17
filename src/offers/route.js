'use strict';

const {Router} = require(`express`);
const {getOffers} = require(`../generate/offer-generate.js`);
const {NotFoundError, IllegalArgumentError} = require(`../errors.js`);
const DEFAULT_SKIP_VALUE = 0;
const DEFAULT_LIMIT_VALUE = 20;

// eslint-disable-next-line new-cap
const offersRouter = Router();
const offers = getOffers(DEFAULT_LIMIT_VALUE);

const handleSkip = (arrayOfOffers, skip = DEFAULT_SKIP_VALUE) => arrayOfOffers.slice(skip);

const handleLimit = (arrayOfOffers, limit = DEFAULT_LIMIT_VALUE) => arrayOfOffers.slice(0, limit);

offersRouter.get(``, (req, res) => {
  const {skip, limit} = req.query;
  const copy = offers.slice();
  const filteredOffers = handleLimit(handleSkip(copy, skip), limit);
  if (skip < 0 || skip > offers.length || limit <= 0 || !filteredOffers.length) {
    throw new IllegalArgumentError(`Неверное значение параметра!`);
  }
  res.send(filteredOffers);
});

offersRouter.get(`/:date`, (req, res) => {
  const offerDate = req.params.date;
  const matches = offers.filter((it) => it.date === Number(offerDate));
  if (!matches.length) {
    throw new NotFoundError(`Объявлений с датой "${offerDate}" не нашлось!`);
  }
  res.send(matches);
});


const ERROR_HANDLER = (err, req, res, _next) => {
  console.error(err);
  res.status(err.code || 500).send(err.message);
};

offersRouter.use(ERROR_HANDLER);


module.exports = {
  offersRouter
};


