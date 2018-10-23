'use strict';

const {Router, json} = require(`express`);
const {getOffers} = require(`../generate/offer-generate.js`);
const {NotFoundError, BadRequest} = require(`../errors.js`);
const {isInteger} = require(`../utils.js`);
const multer = require(`multer`);
const DEFAULT_SKIP_VALUE = 0;
const DEFAULT_LIMIT_VALUE = 20;
const {validate} = require(`./validation.js`);

// eslint-disable-next-line new-cap
const offersRouter = Router();
const upload = multer({storage: multer.memoryStorage()});

const handleSkip = (offers, skip) => offers.slice(skip);
const handleLimit = (offers, limit) => offers.slice(0, limit);

const offers = getOffers(DEFAULT_LIMIT_VALUE);

const jsonParser = json();

const skipValidationFn = (req, res, next) => {
  const skip = req.query.skip || DEFAULT_SKIP_VALUE;
  if (!isInteger(Number(skip)) || skip > offers.length || skip < 0) {
    throw new BadRequest(`Неверное значение параметра skip!`);
  }
  next();
};

const limitValidationFn = (req, res, next) => {
  const limit = req.query.limit || DEFAULT_LIMIT_VALUE;
  if (!isInteger(Number(limit)) || limit < 0) {
    throw new BadRequest(`Неверное значение параметра limit!`);
  }
  next();
};

offersRouter.get(``, [skipValidationFn, limitValidationFn, (req, res) => {
  const {skip, limit} = req.query;
  const filteredOffers = handleLimit(handleSkip(offers, skip), limit);
  if (!filteredOffers.length) {
    throw new BadRequest(`Неверное значение параметра skip или limit!`);
  }
  res.send(filteredOffers);
}
]);

offersRouter.get(`/:date`, (req, res) => {
  const offerDate = req.params.date;
  const match = offers.find((it) => it.date === Number(offerDate));
  if (!match) {
    throw new NotFoundError(`Объявлений с датой ${offerDate} не нашлось!`);
  }
  res.send(match);
});


offersRouter.post(``, jsonParser, upload.single(`avatar`), (req, res) => {
  const body = req.body;
  const avatar = req.file;
  if (avatar) {
    body.avatar = {name: avatar.originalname};
  }
  res.send(validate(body));
});


/* offersRouter.use((err, req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(err.code).json(err.message);
  }
});*/

module.exports = {
  offersRouter
};


