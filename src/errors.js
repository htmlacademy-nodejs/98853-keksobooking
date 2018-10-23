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
  constructor(message, field) {
    super(message);
    this.code = 400;
    this.name = `Validation Error`;
    this.field = field;
  }

  getField() {
    return this.field;
  }
}


module.exports = {
  NotFoundError,
  BadRequest,
  ValidationError
};
