'use strict';

const {Router, json} = require(`express`);
const {NotFoundError, BadRequest, ValidationError} = require(`../errors.js`);
const {isInteger} = require(`../utils.js`);
const multer = require(`multer`);
const DEFAULT_SKIP_VALUE = 0;
const DEFAULT_LIMIT_VALUE = 20;
const {validate} = require(`./validation.js`);
const generatorOptions = require(`../data/generator-options.js`);
const {getRandomFromArr} = require(`../utils.js`);
const toStream = require(`buffer-to-stream`);

const MIMETYPES = [`image/png`, `image/jpg`];
// eslint-disable-next-line new-cap
const offersRouter = Router();
const upload = multer({storage: multer.memoryStorage()});

const isImageMimeType = (files) => {
  const array = Array.isArray(files) ? files : [files];
  const errors = [];
  array.forEach((it) => {
    if (!MIMETYPES.includes(it.mimetype)) {
      errors.push({
        fieldName: it.fieldname,
        errorMessage: `Недопустимый формат файла ${it.originalname}`
      });
    }
  });
  if (errors.length) {
    throw new ValidationError(errors);
  }
};

const filterOffers = async (cursor, skip = DEFAULT_SKIP_VALUE, limit = DEFAULT_LIMIT_VALUE) => ({
  data: await cursor.skip(Number(skip)).limit(Number(limit)).toArray(),
  skip,
  limit,
  total: await cursor.count()
});


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
  const filteredOffers = await filterOffers(offers, skip, limit);
  if (!filteredOffers.data.length) {
    throw new BadRequest(`Неверное значение параметра skip или limit!`);
  }
  res.send(filteredOffers);
})
]);

const dateValidation = (req, res, _next) => {
  const offerDate = req.params.date;
  if (isNaN(offerDate)) {
    throw new BadRequest(`Невереный формат даты`);
  }
  _next();
};

const getOfferByDate = async (req) => {
  const offerDate = req.params.date;
  const offer = await offersRouter.offerStore.getOffer(offerDate);
  console.log(offer);
  if (!offer) {
    throw new NotFoundError(`Объявлений с датой ${offerDate} не нашлось!`);
  }
  return offer;
};

offersRouter.get(`/:date`, [dateValidation, asyncMiddleware(async (req, res) => {
  const offer = await getOfferByDate(req);
  res.send(offer);
})]);


offersRouter.get(`/:date/avatar`, [dateValidation, asyncMiddleware(async (req, res) => {
  const offerDate = req.params.date;
  const offer = await offersRouter.offerStore.getOffer(offerDate);
  console.log(offer);
  if (!offer) {
    throw new NotFoundError(`Объявлений с датой ${offerDate} не нашлось!`);
  }

  const result = await offersRouter.imageStore.get(offer._id);
  if (!result) {
    throw new NotFoundError(`Аватар автора объявления с датой ${offer.date} не найден`);
  }

  const {stream, info} = result;

  res.header(`Content-Type`, `image/jpg`);
  res.header(`Content-Length`, info.length);

  res.on(`error`, (e) => console.error(e));
  res.on(`end`, () => res.end());

  stream.on(`error`, (e) => console.error(e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
})]);


const dataValidation = (req, res, _next) => {
  if (req.files && Object.keys(req.files).length) {
    const images = req.files[`images`];
    if (req.files[`avatar`]) {
      const avatar = req.files[`avatar`][0];
      isImageMimeType(avatar);
      req.body.avatar = avatar.originalname;
    }
    if (images) {
      isImageMimeType(images);
      req.body.preview = images[0].originalname;
    }
  }
  validate(req.body);
  _next();
};

const formatData = (req, res, _next) => {
  const {body} = req;
  const data = {};
  const name = body.name || getRandomFromArr(generatorOptions.NAMES);
  const coordinates = body.address.split(`,`);
  data.author = {
    name
  };
  if (body.avatar) {
    data.author.avatar = body.avatar;
  }
  data.offer = body;
  data.location = {x: coordinates[0], y: coordinates[1]};
  data.date = Date.now();
  delete data.offer.avatar;
  delete data.offer.location;
  delete data.offer.name;
  req.body = data;
  _next();
};

const saveAndSendData = asyncMiddleware(async (req, res, _next) => {
  const {body} = req;
  const result = await offersRouter.offerStore.save(body);
  const {insertedId} = result;
  if (req.files && Object.keys(req.files).length) {
    const images = req.files[`images`];
    if (req.files[`avatar`]) {
      const avatar = req.files[`avatar`][0];
      await offersRouter.imageStore.save(insertedId, toStream(avatar.buffer));
    }
    if (images) {
      images.forEach(async (it) => await offersRouter.imageStore.save(insertedId, toStream(it.buffer)));
    }
  }
  res.send(body);
});

let cpUpload = upload.fields([{name: `avatar`, maxCount: 1}, {name: `images`, maxCount: 8}]);
offersRouter.post(``, jsonParser, cpUpload, [dataValidation, formatData, saveAndSendData]);


module.exports = (offerStore, imageStore) => {
  offersRouter.offerStore = offerStore;
  offersRouter.imageStore = imageStore;
  return offersRouter;
};
