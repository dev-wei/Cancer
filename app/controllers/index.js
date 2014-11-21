'use strict';
var _ = require('lodash');

module.exports.getHome = function (req, res) {
  res.render('app/home', {
    user: req.user ? JSON.stringify(req.user) : "null"
  });
};
