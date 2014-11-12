'use strict';
var _ = require('lodash');

module.exports.index = function (req, res) {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : "null"
  });
};
