'use strict';
var _ = require('lodash');

module.exports.test = function (req, res) {
  res.render('tests/' + req.param('name'), {});
};
