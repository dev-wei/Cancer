/**
 * Module dependencies.
 */
var _ = require('underscore');

exports.render = function(req, res) {
    res.render('tests/' + req.param('name'), {});
};
