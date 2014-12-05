'use strict';
var Configuration = function (ngModule) {
  var _ = require('lodash');

  ngModule.provider('APP_CONFIG', function () {
    this.$get = function () {
      throw new Error('APP_CONFIG unavailable: see configuration.js.');
    };
  });
  ngModule.service('Configuration', function (APP_CONFIG) {
    this.getConfig = _.constant(APP_CONFIG.return);
  });
};

module.exports = Configuration;


