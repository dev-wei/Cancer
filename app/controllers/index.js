'use strict';
var _ = require('lodash');

var IndexController = function () {
  this.index = function (req, res) {
    res.render('index', {
      user: req.user ? JSON.stringify(req.user) : "null"
    });
  };
};

module.exports = new IndexController();
