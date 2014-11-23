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
          var defaultItem = {
            url: '#',
            target: '_self',
            iconClass: 'icon-tbd',
            title: 'TBD'
          };

          if ($scope.items && _.isArray($scope.items)) {
            $scope.items = _.map($scope.items,
              function (item) {
                return _.defaults(item, defaultItem);
              });
          }
        },
        template: $templateCache.get('retinaMenu'),
        link: function ($scope, element, attrs) {
        }
      };
    });
};