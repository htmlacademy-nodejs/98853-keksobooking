'use strict';

const {Router, json} = require(`express`);
const {NotFoundError, BadRequest} = require(`../errors.js`);
const {isInteger} = require(`../utils.js`);
const multer = require(`multer`);
const DEFAULT_SKIP_VALUE = 0;
const DEFAULT_LIMIT_VALUE = 20;
const {validate} = require(`./validation.js`);
const generatorOptions = require(`../data/generator-options.js`);
const {getRandomFromArr} = require(`../utils.js`);
const toStream = require(`buffer-to-stream`);
const offerStore = require(`./store.js`);
const imageStore = require(`../images/store.js`);


// eslint-disable-next-line new-cap
const offersRouter = Router();
const upload = multer({storage: multer.memoryStorage()});


const handleSkip = (offers, skip) => offers.skip(Number(skip));
const handleLimit = (offers, limit) => offers.limit(Number(limit));


const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const jsonParser = json();

const skipValidationFn = (req, res, next) => {
  const skip = req.query.skip || DEFAULT_SKIP_VALUE;
  if (!isInteger(Number(skip)) || skip < 0) {
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

offersRouter.get(``, [skipValidationFn, limitValidationFn, asyncMiddleware(async (req, res) => {
  const {skip, limit} = req.query;
  const offers = await offersRouter.offerStore.getAllOffers();
  const filteredOffers = await handleLimit(handleSkip(offers, skip), limit).toArray();
  if (!filteredOffers.length) {
    throw new BadRequest(`Неверное значение параметра skip или limit!`);
  }
  res.send(filteredOffers);
})
]);

offersRouter.get(`/:date`, asyncMiddleware(async (req, res) => {
  const offerDate = req.params.date;
  const offer = await offersRouter.offerStore.getOffer(offerDate);
  if (!offer) {
    throw new NotFoundError(`Объявлений с датой ${offerDate} не нашлось!`);
  }
  res.send(offer);
}));


offersRouter.get(`/:date/avatar`, asyncMiddleware(async (req, res) => {
  const offerDate = req.params.date;

  const offer = await offersRouter.offerStore.getOffer(offerDate);
  if (!offer) {
    throw new NotFoundError(`Объявлений с датой ${offerDate} не нашлось!`);
  }

  const {info, stream, mimetype} = await offersRouter.imageStore.get(offer._id);

  if (!info) {
    throw new NotFoundError(`Файл не найден!`);
  }

  res.header(`Content-Type`, mimetype);
  res.header(`Content-Length`, info.length);

  res.on(`error`, (e) => console.error(e));
  res.on(`end`, () => res.end());

  stream.on(`error`, (e) => console.error(e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
}));


const dataValidation = (req, res, _next) => {
  const avatar = req.file;
  if (avatar) {
    req.body.avatar = {name: avatar.originalname};
  }
  validate(req.body);
  _next();
};

const setDataValue = (req, res, _next) => {
  const {body} = req;
  if (!body.name) {
    body.name = getRandomFromArr(generatorOptions.NAMES);
  }
  const coordinates = body.address.split(`,`);
  body.location = {x: coordinates[0], y: coordinates[1]};
  _next();
};

const saveAndSendData = asyncMiddleware(async (req, res, _next) => {
  const {body} = req;
  const result = await offersRouter.offerStore.save(body);
  const {insertedId} = result;
  const avatar = req.file;

  if (avatar) {
    await offersRouter.imageStore.save(insertedId, toStream(avatar.buffer));
  }

  res.send(`Данные загружены успешно!`);
});

offersRouter.post(``, jsonParser, upload.single(`avatar`), [dataValidation, setDataValue, saveAndSendData]);


module.exports = (offerStore, imageStore) => {
  offersRouter.offerStore = offerStore;
  offersRouter.imageStore = imageStore;
  return offersRouter;
};



