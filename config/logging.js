'use strict';

var _ = require('lodash');
var path = require('path');
var log4js = require('log4js');
var config = require('./config');

var Logger = function () {
  log4js.configure(
    path.join(
      config.root,
      'config/env/',
      config.env + '.log4js.json'));

  this.getLogger = function (categoryName) {
    if (_.isString(categoryName) &&
      !_.isEmpty(categoryName)) {
      return log4js.getLogger(categoryName);
    }
    throw 'category can not be empty';
  };

  this.getDefaultLogger = function () {
    return log4js.getDefaultLogger();
  };
};

module.exports = new Logger();
