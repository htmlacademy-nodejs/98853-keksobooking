'use strict';

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
}

class IllegalArgumentError extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
  }
}

module.exports = {
  NotFoundError,
  IllegalArgumentError
};
