'use strict';
var HttpInterceptor = function (ngModule) {
  var _ = require('lodash');

  ngModule.factory('HttpInterceptor', function () {
    return {
      'request': function(config) {
        return config;
      }
    };
  });
};

module.exports = HttpInterceptor;