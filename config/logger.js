var log4js = require('log4js');

module.exports = (function () {
    "use strict";

    (function () {
        log4js.configure(__dirname + '/../config/env/' + process.env.NODE_ENV + '.log4js.json');
    }());

    var getLogger = function (categoryName) {
        if (!categoryName) {
            return log4js.getDefaultLogger();
        }
        return log4js.getLogger(categoryName);
    };

    return {
        getLogger: getLogger
    };
}());
