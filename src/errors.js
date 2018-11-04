'use strict';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
    this.name = `Not Found`;
  }
}

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
    this.name = `Bad Request`;
  }
}

class ValidationError extends Error {
  constructor(errors) {
    super(errors);
    this.code = 400;
    this.name = `Validation Error`;
    this.message = errors.map((err) => {
      return Object.assign({}, {error: this.name}, err);
    });
  }
}

module.exports = {
  NotFoundError,
  BadRequest,
  ValidationError
};
