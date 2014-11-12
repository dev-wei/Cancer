'use strict';
var _ = require('lodash');
var path = require('path');

module.exports = function (browserSources, browser, shims) {

  this.getConfig = function () {
    var weaklyShimmed = _(shims).pick(
      function (shim) {
        return !_.isString(shim) && _.isEmpty(shim.exports);
      }).keys().value();

    return {
      exclude: _.keys(browser),
      source: _(browser).pick(weaklyShimmed).values().value(),
      require: _(browser).omit(
        function (val, key) {
          return _.contains(weaklyShimmed, key);
        }).keys().value()
    };
  };

  this.getBrowserSourceFiles = function () {
    return _.values(browserSources);
  };

  this.getCmd = function (isApp, dest, source, cliFlags) {
    var includeDep = function (key) {
      return [dependenciesFlag, key];
    };

    var dependencies = this.getConfig();
    var dependenciesFlag = (isApp ? '-x' : '-r');
    var src = isApp ? source : dependencies.source;
    var includes = _.map(
      (isApp ? dependencies.exclude : dependencies.require),
      includeDep);

    var cmd = _([
      'node',
      'node_modules/browserify/bin/cmd.js',
      '--debug',
      src, includes, '-o', dest, cliFlags
    ]).flatten().compact().join(' ');

    return cmd;
  };
};