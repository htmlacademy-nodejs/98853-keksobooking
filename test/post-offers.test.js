'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const {app} = require(`../src/server.js`);

const sent = {
  name: `Pavel`,
  title: `Маленькая квартирка рядом с парком`,
  address: `570, 472`,
  description: `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`,
  price: 30000,
  type: `flat`,
  rooms: 1,
  guests: 1,
  checkin: `9:00`,
  checkout: `7:00`,
  features: [`elevator`, `conditioner`]
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
    assert.deepEqual(offer, sent);
  });

  it(`send offer as multipart/form-data`, async () => {
    const response = await request(app).
      post(`/api/offers`).
      field(`title`, sent.title).
      field(`price`, sent.price).
      field(`features`, sent.features).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);
    const offer = response.body;
    assert.deepEqual(offer, {title: sent.title, price: sent.price, features: sent.features});
  });

  it(`send offer with avatar as multipart/form-data`, async () => {
    const response = await request(app).
      post(`/api/offers`).
      field(`title`, sent.title).
      field(`price`, sent.price).
      field(`features`, sent.features).
      attach(`avatar`, `test/fixtures/keks.png`).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(200).
      expect(`Content-Type`, /json/);
    const offer = response.body;
    assert.deepEqual(offer, {title: sent.title, price: sent.price, features: sent.features, avatar: {name: `keks.png`}});
  });

});

