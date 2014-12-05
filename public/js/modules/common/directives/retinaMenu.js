'use strict';

module.exports = function (ngModule) {
  var _ = require('lodash');
  ngModule.directive('retinaMenu',
    function ($templateCache) {
      return {
        restrict: 'C',
        scope: {
          items: '='
        },
        controller: function ($scope) {
          $scope.$watch('items', function (newVal) {
          });
        },
        template: $templateCache.get('retinaMenu'),
        link: function ($scope, element, attrs) {
        }
      };
    });
};