'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);
const {ERROR_HANDLER} = require(`../src/server.js`);
const offersStoreMock = require(`./mock/offers-store-mock`);
const imagesStoreMock = require(`./mock/images-store-mock`);
const offersRouter = require(`../src/offers/routes/main.js`)(offersStoreMock, imagesStoreMock);

const app = express();

app.use(`/api/offers`, offersRouter);
app.use(ERROR_HANDLER);

const sent = {
  name: `Petr`,
  title: `Маленькая квартирка рядом с парком!!!!!!!!!!!!!!`,
  price: 30000,
  type: `flat`,
  checkin: `12:00`,
  checkout: `12:00`,
  rooms: 2,
  address: `471,545`,
  avatar: `keks.png`
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
    const {body} = response;
    assert.deepEqual(body.offer, {"title": sent.title, "address": sent.address, "type": sent.type, "price": sent.price, "checkin": sent.checkin, "checkout": sent.checkout, "rooms": sent.rooms});
    assert.deepEqual(body.author, {"name": sent.name, "avatar": sent.avatar});
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
    const {body} = response;
    assert.deepEqual(body.offer, {"title": sent.title, "address": sent.address, "type": sent.type, "price": sent.price, "checkin": sent.checkin, "checkout": sent.checkout, "rooms": sent.rooms});
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
    const {body} = response;
    assert.deepEqual(body.offer, {"title": sent.title, "address": sent.address, "type": sent.type, "price": sent.price, "checkin": sent.checkin, "checkout": sent.checkout, "rooms": sent.rooms});
    assert.deepEqual(body.author, {"name": sent.name, "avatar": sent.avatar});
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
    const {body} = response;
    assert.deepEqual(body.offer, {"title": sent.title, "address": sent.address, "type": sent.type, "price": sent.price, "checkin": sent.checkin, "checkout": sent.checkout, "rooms": sent.rooms});
    assert.deepEqual(body.author, {"name": sent.name, "avatar": sent.avatar});
  });


  it(`if send incorrect data server will return the correct response`, async () => {
    await request(app).
      post(`/api/offers`).
      field(`title`, `Title length less than 30`).
      field(`type`, `box`).
      field(`price`, `2000000`).
      field(`checkin`, `122:00`).
      field(`checkout`, `17:00`).
      field(`features`, [`elevator`, `conditioner`, `telefon`]).
      field(`rooms`, `600000`).
      field(`address`, `541,222`).
      set(`Accept`, `application/json`).
      set(`Content-Type`, `multipart/form-data`).
      expect(400).
      expect(`Content-Type`, /json/).
      expect(JSON.stringify([
        {
          error: `Validation Error`,
          fieldName: `title`,
          errorMessage: `Введите значение от 30 до 140 символов`
        },
        {
          error: `Validation Error`,
          fieldName: `type`,
          errorMessage: `Введите одно из следующий значений: flat, palace, house, bungalo`
        },
        {
          error: `Validation Error`,
          fieldName: `price`,
          errorMessage: `Введите значение от 1000 до 1000000`
        },
        {
          error: `Validation Error`,
          fieldName: `checkin`,
          errorMessage: `Введите время в формате HH:mm`
        },
        {
          error: `Validation Error`,
          fieldName: `rooms`,
          errorMessage: `Введите значение от 0 до 1000`
        },
        {
          error: `Validation Error`,
          fieldName: `features`,
          errorMessage: `Недопустимое значение`
        }
      ])
      );
  });


});

