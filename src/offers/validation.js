'use strict';

const {ValidationError} = require(`../errors.js`);
const generatorOptions = require(`../data/generator-options.js`);

const titleLengthValidate = (min, max, title) => title.length >= min && title.length < max;

const typeValidate = (type) => generatorOptions.TYPES.includes(type);


const validate = (data) => {
  const errors = [];
  if (!data.title || !titleLengthValidate(30, 140, data.title)) {
    errors.push({title: `is required`});
  }
  if (!data.type || !typeValidate(data.type)) {
    errors.push({type: `is required`});
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = {
  validate
};
