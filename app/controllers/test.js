/**
 * Module dependencies.
 */
var _ = require('underscore');

exports.render = function(req, res) {
    'use strict';
    res.render('tests/' + req.param('name'), {});
};
