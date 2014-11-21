'use strict';
var _ = require('lodash');
var config = require('../../../config/config');
var base = require('../base');

var ApiController = function () {
  base.call(this);

  var self = this;
  this.getConfig = function (req, res) {
    self.ok(req, res, config.app);
  };

  this.getVersion = function (req, res) {
    self.ok(req, res, config.env);
  };
};
ApiController.prototype = Object.create(base.prototype);
ApiController.prototype.constructor = ApiController;

module.exports = new ApiController();