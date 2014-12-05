'use strict';
var _ = require('lodash');

var Header = function (ngModule) {
  ngModule.controller('Header', function ($scope, Ajax) {
    $scope.menus = [];
    Ajax.get(Ajax.api.MENU)
      .then(function (data) {
        _.forEach(data.menus, function (menu) {
          $scope.menus.push(menu);
        });
      });
  });
};

module.exports = Header;

