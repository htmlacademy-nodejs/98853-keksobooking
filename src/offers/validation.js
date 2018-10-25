'use strict';

const {ValidationError} = require(`../errors.js`);
const generatorOptions = require(`../data/generator-options.js`);
const {getInvalidValue, getRandomFromArr} = require(`../utils.js`);

const TimeLimits = {
  MIN_HOURS: 0,
  MAX_HOURS: 24,
  MIN_MINUTS: 0,
  MAX_MINUTS: 60
};

const lengthValidate = (min, max, title) => title.length >= min && title.length < max;
const typeValidate = (type) => generatorOptions.TYPES.includes(type);
const inRangeValidate = (min, max, value) => value >= min && value < max;
const checkValidate = (check) => {
  const array = check.split(`:`);
  const hours = Number(array[0]);
  const minuts = Number(array[1]);
  const hoursValidate = hours >= TimeLimits.MIN_HOURS && hours <= TimeLimits.MAX_HOURS;
  const minutsValidate = minuts >= TimeLimits.MIN_MINUTS && minuts <= TimeLimits.MAX_MINUTS;
  return hoursValidate && minutsValidate;
};

const REQUIRED_VALUES = {
  title: {
    minLength: 30,
    maxLength: 140,
    validate(title) {
      return lengthValidate(this.minLength, this.maxLength, title);
    },
    getErrorMessage() {
      return `Введите значение от ${this.minLength} до ${this.maxLength} символов`
    }
  },
  type: {
    validate(type) {
      return typeValidate(type);
    },
    getErrorMessage() {
      return `Введите одно из следующий значений: ${generatorOptions.TYPES.join(`, `)}`;
    }
  },
  price: {
    minPrice: 1000,
    maxPrice: 1000000,
    validate(price) {
      return inRangeValidate(this.minPrice, this.maxPrice, price);
    },
    getErrorMessage() {
      return `Введите значение от ${this.minPrice} до ${this.maxPrice}`
    }
  },
  checkin: {
    validate(checkin) {
      return checkValidate(checkin);
    },
    getErrorMessage() {
      return `Введите время в формате HH:mm`
    }
  },
  checkout: {
    validate(checkout) {
      return checkValidate(checkout);
    },
    getErrorMessage() {
      return `Введите время в формате HH:mm`
    }
  },
  rooms: {
    minRoomsCount: 0,
    maxRoomsCount: 1000,
    validate(rooms) {
      return inRangeValidate(this.minRoomsCount, this.maxRoomsCount, rooms);
    },
    getErrorMessage() {
      return `Введите значение от ${this.minRoomsCount} до ${this.maxRoomsCount}`
    }
  },
  address: {
    minLength: 2,
    maxLength: 100,
    validate(address) {
      return address && lengthValidate(this.minLength, this.maxLength, address);
    },
    getErrorMessage() {
      return `Введите значение от ${this.minLength} до ${this.maxLength} символов`
    }
  }
};

let required = Object.keys(REQUIRED_VALUES);

const validate = (data) => {
  const errors = [];
  // проверяем все ли обязательные поля присутсвуют в приходящих данных, если да, валидируем их
  required.forEach((it) => {
    if (!Object.keys(data).includes(it)) {
      errors.push({[it]: `is required`});
    } else if (!REQUIRED_VALUES[it].validate(data[it])) {
      errors.push({[it]: REQUIRED_VALUES[it].getErrorMessage()});
    }
  });

  if (!data.name) {
    data.name = getRandomFromArr(generatorOptions.NAMES);
  }
  // если в features присутствуют недопустимые значения, выводим их
  const difference = data.features && data.features.length ? getInvalidValue(data.features, generatorOptions.FEATURES) : false;
  if (difference && difference.length) {
    errors.push({features: `Недопустимое значение ${difference}`});
  }

  const coordinates = data.address.split(`,`);
  data.location = {x: coordinates[0], y: coordinates[1]};

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = {
  validate
};
