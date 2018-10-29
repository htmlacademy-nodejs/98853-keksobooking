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

const isRequire = (data, errMessage) => data ? null : `is required`;
const isLengthInRange = (min, max) => (data, errMessage) => data.length >= min && data.length < max ? null : errMessage;
const isInArray = (array) => (data, errMessage) => array.includes(data) ? null : errMessage;
const isInRange = (min, max) => (data, errMessage) => data >= min && data < max ? null : errMessage;
const isTimeFormat = (data, errMessage) => {
  const array = data.split(`:`);
  const hours = Number(array[0]);
  const MINUTES = Number(array[1]);
  const hoursValidate = hours >= TimeLimits.MIN_HOURS && hours <= TimeLimits.MAX_HOURS;
  const MINUTESValidate = MINUTES >= TimeLimits.MIN_MINUTES && MINUTES <= TimeLimits.MAX_MINUTES;
  return hoursValidate && MINUTESValidate ? null : errMessage;
};
const isArrayOfUniqueValues = (data, errMessage) => {
  if (!data || !data.length) {
    return null;
  }
  return data.length === new Set(data).size ? null : errMessage;
};
const getInvalidValues = (original) => (data, errMessage) => {
  if (!data || !data.length) {
    return null;
  }
  const invalidValues = getInvalidValue(data, original);
  return !invalidValues.length ? null : errMessage;
};

const offersSchema = {
  title: {
    validationFunctions: [isRequire, isLengthInRange(ValidateOptions.title.MIN_LENGTH, ValidateOptions.title.MAX_LENGTH)],
    errorMessage: `Введите значение от ${ValidateOptions.title.MIN_LENGTH} до ${ValidateOptions.title.MAX_LENGTH} символов`
  },
  type: {
    validationFunctions: [isRequire, isInArray(generatorOptions.TYPES)],
    errorMessage: `Введите одно из следующий значений: ${generatorOptions.TYPES.join(`, `)}`
  },
  price: {
    validationFunctions: [isRequire, isInRange(ValidateOptions.price.MIN, ValidateOptions.price.MAX)],
    errorMessage: `Введите значение от ${ValidateOptions.price.MIN} до ${ValidateOptions.price.MAX}`
  },
  checkin: {
    validationFunctions: [isRequire, isTimeFormat],
    errorMessage: `Введите время в формате HH:mm`
  },
  checkout: {
    validationFunctions: [isRequire, isTimeFormat],
    errorMessage: `Введите время в формате HH:mm`
  },
  rooms: {
    validationFunctions: [isRequire, isInRange(ValidateOptions.rooms.MIN, ValidateOptions.rooms.MAX)],
    errorMessage: `Введите значение от ${ValidateOptions.rooms.MIN} до ${ValidateOptions.rooms.MAX}`
  },
  address: {
    validationFunctions: [isRequire, isLengthInRange(ValidateOptions.address.MIN_LENGTH, ValidateOptions.address.MAX_LENGTH)],
    errorMessage: `Введите значение от ${ValidateOptions.address.MIN_LENGTH} до ${ValidateOptions.address.MAX_LENGTH} символов`
  },
  features: {
    validationFunctions: [getInvalidValues(generatorOptions.FEATURES), isArrayOfUniqueValues],
    errorMessage: `Недопустимое значение`
  }
};

let fields = Object.keys(offersSchema);

const validate = (data) => {
  const errors = fields.reduce((acc, it) => {
    offersSchema[it].validationFunctions.forEach((fn) => {
      const errorMessage = fn.name === `isRequire` ? `is required` : offersSchema[it].errorMessage;
      const error = fn(data[it], errorMessage);
      if (error) {
        acc.push({
          fieldName: it,
          errorMessage
        });
      }
    });
    return acc;
  }, []);

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = {
  validate
};
