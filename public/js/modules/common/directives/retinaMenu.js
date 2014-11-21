'use strict';

module.exports = function (ngModule) {
  var _ = require('lodash');
  ngModule.directive('retinaMenu',
    function ($templateCache) {
      return {
        restrict: 'E',
        scope: {
          items: '='
        },
        controller: function ($scope) {
          var defaultItem = {
            url: '#',
            target: '_self',
            iconClass: 'icon-unknown',
            title: 'Unknown'
          };

          if ($scope.items) {
            $scope.items = _.map($scope.items,
              function (item) {
                return _.merge(defaultItem, item);
              });
          }
        },
        template: $templateCache.get('retinaMenu'),
        link: function ($scope, element, attrs) {
        }
      };
    });
};