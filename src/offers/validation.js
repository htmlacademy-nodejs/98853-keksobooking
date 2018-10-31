'use strict';

const {ValidationError} = require(`../errors.js`);
const generatorOptions = require(`../data/generator-options.js`);
const {getInvalidValue} = require(`../utils.js`);

const TimeLimits = {
  MIN_HOURS: 0,
  MAX_HOURS: 24,
  MIN_MINUTES: 0,
  MAX_MINUTES: 60
};

const ValidateOptions = {
  title: {
    MIN_LENGTH: 30,
    MAX_LENGTH: 140
  },
  price: {
    MIN: 1000,
    MAX: 1000000,
  },
  rooms: {
    MIN: 0,
    MAX: 1000,
  },
  address: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  }
};

const isRequire = (data) => data ? null : `is required`;
const isLengthInRange = (min, max) => (data) => data.length >= min && data.length < max ? null : `Введите значение от ${min} до ${max} символов`;
const isInArray = (array) => (data) => array.includes(data) ? null : `Введите одно из следующий значений: ${array.join(`, `)}`;
const isInRange = (min, max) => (data) => data >= min && data < max ? null : `Введите значение от ${min} до ${max}`;
const isTimeFormat = (data) => {
  const array = data.split(`:`);
  const hours = Number(array[0]);
  const MINUTES = Number(array[1]);
  const hoursValidate = hours >= TimeLimits.MIN_HOURS && hours <= TimeLimits.MAX_HOURS;
  const MINUTESValidate = MINUTES >= TimeLimits.MIN_MINUTES && MINUTES <= TimeLimits.MAX_MINUTES;
  return hoursValidate && MINUTESValidate ? null : `Введите время в формате HH:mm`;
};

const isArrayOfUniqueValues = (data) => {
  const array = Array.isArray(data) ? data : [data];
  if (array && array.length > 1) {
    return array.length === new Set(array).size ? null : `Значения не должны повторяться`;
  }
  return null;
};


const getInvalidValues = (original) => (data) => {
  if (data && data.length) {
    const invalidValues = getInvalidValue(data, original);
    return !invalidValues.length ? null : `Недопустимое значение`;
  }
  return null;
};


const offersValidationSchema = {
  title: [isRequire, isLengthInRange(ValidateOptions.title.MIN_LENGTH, ValidateOptions.title.MAX_LENGTH)],
  type: [isRequire, isInArray(generatorOptions.TYPES)],
  price: [isRequire, isInRange(ValidateOptions.price.MIN, ValidateOptions.price.MAX)],
  checkin: [isRequire, isTimeFormat],
  checkout: [isRequire, isTimeFormat],
  rooms: [isRequire, isInRange(ValidateOptions.rooms.MIN, ValidateOptions.rooms.MAX)],
  address: [isRequire, isLengthInRange(ValidateOptions.address.MIN_LENGTH, ValidateOptions.address.MAX_LENGTH)],
  features: [getInvalidValues(generatorOptions.FEATURES), isArrayOfUniqueValues]
};

let fields = Object.keys(offersValidationSchema);

const validate = (data) => {
  const errors = fields.reduce((acc, it) => {
    offersValidationSchema[it].forEach((fn) => {
      const error = fn(data[it]);
      if (error) {
        acc.push({
          fieldName: it,
          errorMessage: error
        });
      }
    });
    return acc;
  }, []);

  if (errors.length) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = {
  validate
};
