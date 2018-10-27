'use strict';

const {ValidationError} = require(`../errors.js`);
const generatorOptions = require(`../data/generator-options.js`);
const {getInvalidValue} = require(`../utils.js`);

const TimeLimits = {
  MIN_HOURS: 0,
  MAX_HOURS: 24,
  MIN_MINUTS: 0,
  MAX_MINUTS: 60
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

const isRequire = (data, errMessage) => data ? null : errMessage;
const isLengthInRange = (min, max) => (data, errMessage) => data.length >= min && data.length < max ? null : errMessage;
const isInArray = (array) => (data, errMessage) => array.includes(data) ? null : errMessage;
const isInRange = (min, max) => (data, errMessage) => data >= min && data < max ? null : errMessage;
const isTimeFormat = (data, errMessage) => {
  const array = data.split(`:`);
  const hours = Number(array[0]);
  const minuts = Number(array[1]);
  const hoursValidate = hours >= TimeLimits.MIN_HOURS && hours <= TimeLimits.MAX_HOURS;
  const minutsValidate = minuts >= TimeLimits.MIN_MINUTS && minuts <= TimeLimits.MAX_MINUTS;
  return hoursValidate && minutsValidate ? null : errMessage;
};

const isArrayIsValid = (original) => (data, errMessage) => {
  const difference = data && data.length ? getInvalidValue(data, original) : false;
  return !difference || !difference.length ? null : errMessage;
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
    validationFunctions: [isArrayIsValid(generatorOptions.FEATURES)],
    errorMessage: `Недопустимое значение`
  }
};

let fields = Object.keys(offersSchema);

const validate = (data) => {
  const errors = fields.reduce((acc, it) => {
    offersSchema[it].validationFunctions.forEach((fn) => {
      const error = fn(data[it], offersSchema[it].errorMessage);
      if (error) {
        acc.push({
          fieldName: it,
          errorMessage: fn(data[it], error)
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
