'use strict';
var _ = require('lodash');

module.exports.getDefault = function (req, res) {
  res.render('app/t1', {
    user: req.user ? JSON.stringify(req.user) : "null"
  });
};
