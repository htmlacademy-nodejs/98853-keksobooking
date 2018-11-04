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

const getOfferByDate = async (req, router) => {
  const offerDate = req.params.date;
  const offer = await router.offerStore.getOffer(offerDate);
  if (!offer) {
    throw new BadRequest(`Объявлений с датой ${offerDate} не нашлось!`);
  }
  return offer;
};


module.exports = (router) => {
  router.get(`/:date`,
      [dateValidation,
        asyncMiddleware(async (req, res) => {
          const offer = await getOfferByDate(req, router);
          res.send(offer);
        })
      ]);

  router.get(`/:date/avatar`,
      [dateValidation,
        asyncMiddleware(async (req, res) => {
          const offer = await getOfferByDate(req, router);
          const result = await router.imageStore.get(`${offer._id}-avatar`);
          if (!result) {
            throw new NotFoundError(`Аватар автора объявления с датой ${offer.date} не найден`);
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
