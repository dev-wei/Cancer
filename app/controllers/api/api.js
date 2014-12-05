'use strict';
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
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

  this.getMenu = function (req, res) {
    var file = path.resolve(__dirname, '../../data/menu.json');
    var content = fs.readFileSync(file, 'UTF-8');
    var json = JSON.parse(content);
    self.ok(req, res, json);
  };
};
ApiController.prototype = Object.create(base.prototype);
ApiController.prototype.constructor = ApiController;

module.exports = new ApiController();