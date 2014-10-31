var _ = require('lodash');
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
module.exports = _.extend(
    require(__dirname + '/../config/env/all.js'),
    require(__dirname + '/../config/env/' + process.env.NODE_ENV + '.js')
    || {});
