'use strict';
const {asyncMiddleware} = require(`../../utils.js`);
const logger = require(`../../logger`);
const {NotFoundError, BadRequest} = require(`../../errors.js`);

const dateValidation = (req, res, _next) => {
  const offerDate = req.params.date;
  if (isNaN(offerDate)) {
    throw new BadRequest(`Невереный формат даты`);
  }
  _next();
};


module.exports = (router) => {
  router.get(`/:date`,
      [dateValidation,
        asyncMiddleware(async (req, res) => {
          const offer = await router.offersStore.getOffer(req.params.date);
          if (!offer) {
            throw new NotFoundError(`Предложение не найдено`);
          }
          res.send(offer);
        })
      ]);

  router.get(`/:date/avatar`,
      [dateValidation,
        asyncMiddleware(async (req, res) => {
          const offer = await router.offersStore.getOffer(req.params.date);
          if (!offer) {
            throw new BadRequest(`Предложение отсутствует`);
          }
          const result = await router.imagesStore.get(`${offer._id}-avatar`);
          if (!result) {
            throw new NotFoundError(`Предложение не имеет аватара`);
          }

          const {stream, info} = result;

          res.header(`Content-Type`, `image/jpg`);
          res.header(`Content-Length`, info.length);

          res.on(`error`, (e) => logger.error(e));
          res.on(`end`, () => res.end());

          stream.on(`error`, (e) => logger.error(e));
          stream.on(`end`, () => res.end());
          stream.pipe(res);
        })
      ]);
};
