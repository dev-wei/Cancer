'use strict';

var fs = require('fs');
var _ = require('lodash');
var path = require('path');

module.exports = function () {
  var pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  var getConfig = function () {
    var dependencies = {"exclude": _.keys(pkg.browser)};

    var exportless = function (shim) {
      return !_.isString(shim) && _.isEmpty(shim.exports);
    };

    var isNRAlias = function (val, key) {
      return _.contains(weaklyShimmed, key);
    };

    var shims = pkg['browserify-shim'];
    var weaklyShimmed = _(shims).pick(exportless).keys().value();

    dependencies.source = _(pkg.browser).pick(weaklyShimmed).values().value();
    dependencies.require = _(pkg.browser).omit(isNRAlias).keys().value();
    return dependencies;
  };

  var getCmd = function (isApp, dest, source) {
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

    return cmd;
  };

  return {
    "browser": pkg.browser,
    "browserify_shim": pkg.browserify_shim
  };
};