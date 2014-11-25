'use strict';
var moment = require('moment');
var _ = require('lodash');

var BaseController = function () {
  this.HTTP_INTERNAL_ERROR = 500;

  this.getTimestamp = function (start) {
    start = moment(start).utc();
    var now = moment().utc();
    return {
      "timestamp": now.toJSON(),
      "elapsed": now.subtract(start).millisecond()
    };
  };
};
BaseController.prototype = Object.create(Object.prototype);
BaseController.prototype.constructor = BaseController;
BaseController.prototype.ok = function (req, res, json) {
  res.send(_.merge({"return": json}, this.getTimestamp(req._startTime)));
};
BaseController.prototype.error = function (req, res) {
  res.writeHead(this.HTTP_INTERNAL_ERROR, {'Content-Type': 'text/plain'});
  res.send(this.getTimestamp(req._startTime));
};

module.exports = BaseController;