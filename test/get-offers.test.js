'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const {app} = require(`../src/server.js`);

const DEFAULT_LIMIT_VALUE = 20;

// const app = startServer();

describe(`GET /api/offers`, () => {
  /* it(`respond with JSON`, async () => {
    await request(app).
      get(`/api/offers`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((res) => {
        const offers = res.body;
        assert.equal(offers.length, DEFAULT_LIMIT_VALUE);
      });
  });

  it(`if get data from unknown resource server will return the correct error code`, async () => {
    return await request(app).
      get(`/api/oneone`).
      set(`Accept`, `application/json`).
      expect(404).
      expect(`Content-Type`, /html/).
      expect(`Такой страницы не существует!`);
  });

  it(`get offers?skip=2&limit=10`, async () => {
    await request(app).
      get(`/api/offers?skip=2&limit=10`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((res) => {
        const offers = res.body;
        assert.equal(offers.length, 10);
      });
  });

  it(`if enter invalid parameter "skip" server will return the correct error code`, async () => {
    await request(app).
      get(`/api/offers?skip=bla&limit=10`).
      set(`Accept`, `text/html`).
      expect(400).
      expect(`Content-Type`, `text/html; charset=utf-8`).
      expect(`400 Bad Request Неверное значение параметра skip!`);
  });

  it(`if enter invalid parameter "limit" server will return the correct error code`, async () => {
    await request(app).
      get(`/api/offers?skip=2&limit=bla`).
      set(`Accept`, `text/html`).
      expect(400).
      expect(`Content-Type`, `text/html; charset=utf-8`).
      expect(`400 Bad Request Неверное значение параметра limit!`);
  });

  it(`if enter only one parameter "skip" the server will use default value of parameter "limit"`, async () => {
    await request(app).
      get(`/api/offers?skip=3`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((res) => {
        const offers = res.body;
        assert.equal(offers.length, 17);
      });
  });

  it(`if enter only one parameter "limit" the server will use default value of parameter "skip"`, async () => {
    await request(app).
      get(`/api/offers?limit=3`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((res) => {
        const offers = res.body;
        assert.equal(offers.length, 3);
      });
  });

});

describe(`GET /api/offers/:date`, () => {
  it(`if offer with date "1539441679957" is found the server will return this offer`, async () => {
    await request(app).
      get(`/api/offers/1539441679957`).
      set(`Accept`, `application/json`).
      expect(200).
      expect(`Content-Type`, /json/).
      then((res) => {
        const offer = res.body;
        assert.strictEqual(offer.date, 1539441679957);
      });
  });

  it(`if offer with date "345638645873" is not found the server will return the correct error code`, async () => {
    await request(app).
      get(`/api/offers/345638645873`).
      set(`Accept`, `text/html`).
      expect(404).
      expect(`Content-Type`, `text/html; charset=utf-8`).
      expect(`404 Not Found Объявлений с датой 345638645873 не нашлось!`);
  });*/
});
