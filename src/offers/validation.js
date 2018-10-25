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
  const minuts = Number(array[1])
  const hoursValidate = hours >= TimeLimits.MIN_HOURS && hours <= TimeLimits.MAX_HOURS;
  const minutsValidate = minuts >= TimeLimits.MIN_MINUTS && minuts <= TimeLimits.MAX_MINUTS;
  return hoursValidate && minutsValidate;
};


const VALIDATION_FUNCTIONS = {
  title: {
    validate() {
      return lengthValidate(30, 140, this);
    },
    require: true
  },
  type: {
    validate() {
      return typeValidate(this)
    },
    require: true
  },
  price: {
    validate() {
      return inRangeValidate(1, 100000, this)
    },
    require: true
  },
  checkin: {
    validate() {
      return checkValidate(this)
    },
    require: true
  },
  checkout: {
    validate() {
      return checkValidate(this)
    },
    require: true
  },
  rooms: {
    validate() {
      return inRangeValidate(0, 1000, this)
    },
    require: true
  },
  features: {
    validate() {
      const difference = this && this.length ? getInvalidValue(this, generatorOptions.FEATURES) : false;
      return !difference || !difference.length
    }
  },
  address: {
    validate() {
      return data.address && lengthValidate(0, 100, data.address)
    }
  }
  name: {
    validate() {
      return
    }
  }


};

const validate = (data) => {


  const errors = [];

  Object.keys(data).forEach(it => {
    if (it.require) {

    }
    if (!VALIDATION_FUNCTIONS.it.validate()) {
      errors.push({it: it.errorMessage});
    }
  })

  if (!data.name) {
    data.name = getRandomFromArr(generatorOptions.NAMES);
  }



  /*if (!data.title || !lengthValidate(30, 140, data.title)) {
    errors.push({title: `is required`});
  }
  if (!data.type || !typeValidate(data.type)) {
    errors.push({type: `is required`});
  }
  if (!data.price || !inRangeValidate(1, 100000, data.price)) {
    errors.push({price: `is required`});
  }
  if (!data.checkin || !checkValidate(data.checkin)) {
    errors.push({checkin: `is required`});
  }
  if (!data.checkout || !checkValidate(data.checkout)) {
    errors.push({checkout: `is required`});
  }
  if (!data.rooms || !inRangeValidate(0, 1000, data.rooms)) {
    errors.push({rooms: `is required`});
  }
  if (difference && difference.length) {
    errors.push({features: `недопустимое значение ${[...difference]}`});
  }
  if (!data.name) {
    data.name = getRandomFromArr(generatorOptions.NAMES);
  }
  if (data.address && lengthValidate(0, 100, data.address)) {
    const coordinates = data.address.split(`,`);
    data.location = {x: coordinates[0], y: coordinates[1]}
  } else {
    errors.push({address: `is required`});
  }*/
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = {
  validate
};
