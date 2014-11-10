'use strict';
var _ = require('lodash');

var TestController = function () {
  this.tests = function (req, res) {
    res.render('tests/' + req.param('name'), {});
  };
};

module.exports = new TestController();
