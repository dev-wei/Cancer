'use strict';
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

var _ = require('lodash');

module.exports = _.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js')
    || {});
