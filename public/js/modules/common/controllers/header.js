'use strict';
var _ = require('lodash');
var fs = require('fs');

module.exports = function (ngModule) {
  ngModule.controller('Header', function (
    $scope, Configuration) {
    $scope.menus = Configuration.getMenus();
  });
};
