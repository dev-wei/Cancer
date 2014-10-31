'use strict';

var _ = require('lodash');

module.exports = function (grunt) {
  var pkg = grunt.file.readJSON('package.json');

  var getConfig = function () {
    var exportLess = function (shim) {
      return !_.isString(shim) && _.isEmpty(shim.exports);
    };

    var isNRAlias = function (val, key) {
      return _.contains(weaklyShimmed, key);
    };

    var dependencies = {
      exclude: _.keys(pkg.browser)
    };

    var weaklyShimmed = _.pick(pkg.browserify_shim, exportLess).keys().value();
    dependencies.source = _.pick(pkg.browser, weaklyShimmed).values().value();
    dependencies.require = _.omit(pkg.browser, isNRAlias).keys().value();

    grunt.log.debug(JSON.stringify(dependencies, null, 2));
    return dependencies;
  };

  this.getCmd = function (isApp, dest, source) {
    var includeDep = function (key) {
      return [dependenciesFlag, key];
    };

    var dependencies = getConfig();
    var dependenciesFlag = (isApp ? '-x' : '-r');
    var src = isApp ? source : dependencies.source;
    var includes = _.map(
      (isApp ? dependencies.exclude : dependencies.require),
      includeDep);

    var cmd = _([
      'node',
      'node_modules/browserify/bin/cmd.js',
      '--debug',
      src, includes, '-o', dest
    ]).flatten().compact().join(' ');

    grunt.log.debug(cmd);
    return cmd;
  };
};