'use strict';
var _ = require('lodash');

var Header = function (ngModule) {
  ngModule.controller('Header', function ($scope, Ajax) {
    Ajax.get(Ajax.api.MENU)
      .then(function (data) {
        $scope.menus = data.menus;
      });
  });
};

module.exports = Header;

