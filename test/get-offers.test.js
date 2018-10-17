'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const {offersRouter} = require(`../src/offers/route.js`);
const express = require(`express`);

const app = express();

app.use(`/api/offers`, offersRouter);

describe(`GET /api/offers`, () => {
  it(`respond with JSON`, async () => {
    await request(app).
      get(`/api/offers`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((res) => {
        const offers = res.body;
        assert.equal(offers.length, 20);
      });
  });
});

describe(`GET /api/offers/:date`, () => {
  it(`get offer with date 1539441679957`, async () => {
    await request(app).
      get(`/api/offers/1539441679957`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((res) => {
        const offer = res.body;
        assert.strictEqual(offer[0].date, 1539441679957);
      });
  });
  it(`get offer with date 345638645873`, async () => {
    await request(app).
      get(`/api/offers/345638645873`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`Объявлений с датой "345638645873" не нашлось!`).
      expect(`Content-Type`, /html/);
  });
});
