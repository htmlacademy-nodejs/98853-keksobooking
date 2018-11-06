'use strict';

const {ValidationError, BadRequest} = require(`../errors.js`);
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

const REQUIRED_FIELDS = [`title`, `type`, `price`, `checkin`, `checkout`, `rooms`, `address`];

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

// тут я убрал функцию IsRequired (так как проверку делаю отдельно)
const offersValidationSchema = {
  title: [isLengthInRange(ValidateOption.title.MIN_LENGTH, ValidateOption.title.MAX_LENGTH)],
  type: [isInArray(GeneratorOptions.TYPES)],
  price: [isInRange(ValidateOption.price.MIN, ValidateOption.price.MAX)],
  checkin: [isTimeFormat],
  checkout: [isTimeFormat],
  rooms: [isInRange(ValidateOption.rooms.MIN, ValidateOption.rooms.MAX)],
  guests: [],
  description: [],
  address: [isLengthInRange(ValidateOption.address.MIN_LENGTH, ValidateOption.address.MAX_LENGTH)],
  features: [getInvalidValues(GeneratorOptions.FEATURES), isArrayOfUniqueValues],
  avatar: [isImageFormat],
  preview: [isImageFormat],
  name: []
};

const validate = (data) => {
  const errors = [];

  const possibleFields = Object.keys(offersValidationSchema);
  const dataFields = Object.keys(data);

  if (!dataFields.length) {
    throw new BadRequest(`Нельзя отправить пустой объект`);
  }

  const invalidValue = getInvalidValue(dataFields, possibleFields);
  if (invalidValue.length) {
    invalidValue.forEach((invalidField) => errors.push({fieldName: invalidField, errorMessage: `Недопустимое поле`}));
  }

  const emptyFields = getInvalidValue(REQUIRED_FIELDS, dataFields);

  if (emptyFields.length) {
    emptyFields.forEach((emptyField) => errors.push({fieldName: emptyField, errorMessage: `is required`}));
  } else {
    possibleFields.forEach((it) => {
      const validateFunctions = offersValidationSchema[it];
      if (validateFunctions.length) {
        validateFunctions.forEach((fn) => {
          const error = fn(data[it]);
          if (error) {
            errors.push({
              fieldName: it,
              errorMessage: error
            });
          }
        });
      }
    });
  }

  if (errors.length) {
    throw new ValidationError(errors);
  }
};


module.exports = {
  validate
};
