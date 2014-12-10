'use strict';
module.exports = function (ngModule) {
  var _ = require('lodash');
  ngModule.directive('nexusMenu', function ($templateCache) {
    return {
      restrict: 'C',
      scope: {
        items: '='
      },
      template: $templateCache.get('nexusMenu')
    };
  });
};