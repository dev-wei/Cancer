var path = require('path');
var log4js = require('log4js');
var config = require('./config');

module.exports = (function () {
    'use strict';

    (function () {
        log4js.configure(path.join(config.root, 'config/env/', config.env + '.log4js.json'));
    }());

    var getLogger = function (categoryName) {
        if (categoryName &&
            typeof categoryName === 'string' &&
            categoryName !== '') {
            return log4js.getLogger(categoryName);
        }
        throw 'category can not be empty';
    };

    var getDefaultLogger = function () {
        return log4js.getDefaultLogger();
    };

    return {
        getLogger: getLogger,
        getDefaultLogger: getDefaultLogger
    };
}());
