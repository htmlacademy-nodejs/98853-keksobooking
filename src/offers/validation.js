'use strict';

const {ValidationError} = require(`../errors.js`);
const {GeneratorOptions} = require(`../data/generator-options.js`);
const {getInvalidValue, isImageName} = require(`../utils.js`);

const TimeLimit = {
  MIN_HOURS: 0,
  MAX_HOURS: 24,
  MIN_MINUTES: 0,
  MAX_MINUTES: 60
};

const ValidateOption = {
  title: {
    MIN_LENGTH: 30,
    MAX_LENGTH: 140
  },
  price: {
    MIN: 1000,
    MAX: 1000000
  },
  rooms: {
    MIN: 0,
    MAX: 1000
  },
  address: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  name: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  }
};

const isRequired = (data) => data ? null : `Поле не может быть пустым`;
const isImageFormat = (data) => {
  if (data) {
    return isImageName(data) ? null : `Недопустимый формат картинки`;
  }
  return null;
};
const isLengthInRange = (min, max) => (data) => data.length >= min && data.length < max ? null : `Введите значение от ${min} до ${max} символов`;
const isInArray = (array) => (data) => array.includes(data) ? null : `Введите одно из следующий значений: ${array.join(`, `)}`;
const isInRange = (min, max) => (data) => data >= min && data < max ? null : `Введите значение от ${min} до ${max}`;
const isTimeFormat = (data) => {
  const array = data.split(`:`);
  const hours = Number(array[0]);
  const minutes = Number(array[1]);
  const isHoursValid = hours >= TimeLimit.MIN_HOURS && hours <= TimeLimit.MAX_HOURS;
  const isMinutesValid = minutes >= TimeLimit.MIN_MINUTES && minutes <= TimeLimit.MAX_MINUTES;
  return isHoursValid && isMinutesValid ? null : `Введите время в формате HH:mm`;
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
  title: [isRequired, isLengthInRange(ValidateOption.title.MIN_LENGTH, ValidateOption.title.MAX_LENGTH)],
  type: [isRequired, isInArray(GeneratorOptions.TYPES)],
  price: [isRequired, isInRange(ValidateOption.price.MIN, ValidateOption.price.MAX)],
  checkin: [isRequired, isTimeFormat],
  checkout: [isRequired, isTimeFormat],
  rooms: [isRequired, isInRange(ValidateOption.rooms.MIN, ValidateOption.rooms.MAX)],
  guests: [],
  description: [],
  address: [isRequired, isLengthInRange(ValidateOption.address.MIN_LENGTH, ValidateOption.address.MAX_LENGTH)],
  features: [getInvalidValues(GeneratorOptions.FEATURES), isArrayOfUniqueValues],
  avatar: [isImageFormat],
  preview: [isImageFormat],
  name: []
};

const validate = (data) => {
  const fields = Object.keys(offersValidationSchema);
  const invalidValue = getInvalidValue(Object.keys(data), fields)[0];
  if (invalidValue) {
    throw new ValidationError([{
      fieldName: invalidValue,
      errorMessage: `Недопустимое поле: ${invalidValue}`
    }]);
  }
  fields.reduce((acc, it) => {
    if (offersValidationSchema[it].length) {
      offersValidationSchema[it].forEach((fn) => {
        const error = fn(data[it]);
        if (error) {
          acc.push({
            fieldName: it,
            errorMessage: error
          });
          throw new ValidationError(acc);
        }
      });
    }
    return acc;
  }, []);
  return data;
};

module.exports = {
  validate
};
