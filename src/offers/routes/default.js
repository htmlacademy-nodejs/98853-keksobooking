'use strict';
const {asyncMiddleware, getRandomFromArr, isInteger} = require(`../../utils.js`);
const jsonParser = require(`express`).json();
const multer = require(`multer`);
const upload = multer({storage: multer.memoryStorage()});
const {GeneratorOptions} = require(`../../data/generator-options.js`);
const {validate} = require(`../validation.js`);
const {BadRequest, ValidationError} = require(`../../errors.js`);
const toStream = require(`buffer-to-stream`);

const IMAGE_MIMETYPES = [`image/png`, `image/jpg`, `image/jpeg`, `image/gif`];
const DEFAULT_SKIP_VALUE = 0;
const DEFAULT_LIMIT_VALUE = 20;

const validateQueryArgument = (argument) => {
  if (!isInteger(Number(argument)) || !argument.length || argument < 0) {
    throw new BadRequest(`Неверное значение параметра skip или limit!`);
  }
};

const isImageMimeType = (files) => {
  const array = Array.isArray(files) ? files : [files];
  const errors = [];
  array.forEach((it) => {
    if (!IMAGE_MIMETYPES.includes(it.mimetype)) {
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
  skip: Number(skip),
  limit: Number(limit),
  total: await cursor.count()
});

const skipValidationFn = (req, res, next) => {
  const {skip} = req.query;
  if (skip !== undefined) {
    validateQueryArgument(skip);
  }
  next();
};

const limitValidationFn = (req, res, next) => {
  const {limit} = req.query;
  if (limit !== undefined) {
    validateQueryArgument(limit);
  }
  next();
};

const dataValidation = (req, res, _next) => {
  if (req.files && Object.keys(req.files).length) {
    Object.keys(req.files).forEach((it) => {
      const file = req.files[it][0];
      isImageMimeType(file);
      req.body[it] = file.originalname;
    });
  }
  validate(req.body);
  _next();
};

const formatData = (req, res, _next) => {
  const {body} = req;
  const data = {};
  const name = body.name || getRandomFromArr(GeneratorOptions.NAMES);
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


module.exports = (router) => {
  router.get(``,
      [skipValidationFn,
        limitValidationFn,
        asyncMiddleware(async (req, res) => {
          const {skip, limit} = req.query;
          const offers = await router.offersStore.getAllOffers();
          const filteredOffers = await filterOffers(offers, skip, limit);
          res.send(filteredOffers);
        })
      ]);

  router.post(``,
      jsonParser,
      [upload.fields([{name: `avatar`, maxCount: 1}, {name: `preview`, maxCount: 1}]),
        dataValidation,
        formatData,
        asyncMiddleware(async (req, res, _next) => {
          const {body} = req;
          const result = await router.offersStore.saveOne(body);
          const {insertedId} = result;
          if (req.files && Object.keys(req.files).length) {
            Object.keys(req.files).forEach(async (it) => {
              const file = req.files[it][0];
              await router.imagesStore.save(`${insertedId}-${it}`, toStream(file.buffer));
            });
          }
          res.send(body);
        })
      ]
  );
};
