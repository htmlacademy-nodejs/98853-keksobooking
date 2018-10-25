'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const {app} = require(`../src/server.js`);
const {generateEntity} = require(`../src/generate/offer-generate.js`);


const randomOffer = generateEntity();

const sent = {
  name: `Petr`,
  title: `Маленькая квартирка рядом с парком!!!!!!!!!!!!!!`,
  price: 30000,
  type: `flat`,
  checkin: `19:00`,
  checkout: `07:00`,
  rooms: 2,
  address: `471,545`
};

describe(`POST /api/offers`, () => {
  it(`send offer as json`, async () => {
    const response = await request(app).
      post(`/api/offers`).
      send(sent).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/);
    const offer = response.body;
    assert.deepEqual(offer, {...sent, location: {x: `471`, y: `545`}});
  });

 it(`send offer as multipart/form-data`, async () => {
    const response = await request(app).
      post(`/api/offers`).
      field(`name`, sent.name).
      field(`title`, sent.title).
      field(`price`, sent.price).
      field(`type`, sent.type).
      field(`checkin`, sent.checkin).
      field(`checkout`, sent.checkout).
      field(`rooms`, sent.rooms).
      field(`address`, sent.address).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);
    const offer = response.body;
    assert.deepEqual(offer, {...sent, location: {x: `471`, y: `545`}});
  });

  it(`send offer with avatar as multipart/form-data`, async () => {
    const response = await request(app).
      post(`/api/offers`).
      field(`name`, sent.name).
      field(`title`, sent.title).
      field(`price`, sent.price).
      field(`type`, sent.type).
      field(`checkin`, sent.checkin).
      field(`checkout`, sent.checkout).
      field(`rooms`, sent.rooms).
      field(`address`, sent.address).
      attach(`avatar`, `test/fixtures/keks.png`).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);
    const offer = response.body;
    assert.deepEqual(offer, {...sent, location: {x: `471`, y: `545`}, avatar: {name: `keks.png`}});
  });


 it(`if send incorrect data server will return the correct error code`, async () => {
    await request(app).
      post(`/api/offers`).
      field(`title`, `Title length less than 30`).
      field(`type`, `box`).
      field(`price`, `200000`).
      field(`checkin`, `122:00`).
      field(`checkout`, `17:00`).
      field(`features`, [`elevator`, `conditioner`, `telefon`]).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(400).
      expect(`Content-Type`, /json/).
      expect(JSON.stringify([
        {
          error: `Validation Error`,
          fieldName: `title`,
          errorMessage: `is required`
        },
        {
          error: `Validation Error`,
          fieldName: `type`,
          errorMessage: `is required`
        },
        {
          error: `Validation Error`,
          fieldName: `price`,
          errorMessage: `is required`
        },
        {
          error: `Validation Error`,
          fieldName: `checkin`,
          errorMessage: `is required`
        },
        {
          error: `Validation Error`,
          fieldName: `rooms`,
          errorMessage: `is required`
        },
        {
          error: `Validation Error`,
          fieldName: `features`,
          errorMessage: `недопустимое значение telefon`
        },
        {
          error: `Validation Error`,
          fieldName: `address`,
          errorMessage: `is required`
        }
      ])
      );
  });


});

