'use strict';
module.exports = function (ngModule) {
  var _ = require('lodash');
  var DEBOUNCE_DELAY = 150;
  ngModule.service('Resizer', function ($rootScope) {
    return {
      monitor: function (element, fn) {
        function size() {
          return element.outerHeight() + 'x' + element.outerWidth();
        }

        var resizer = _.debounce(function resizer(newVal) {
          // checking visibility becasue when switching tabs, elements 'shrink', which we don't want
          if (newVal !== '0x0' && element.is(':visible')) {
            fn();
          }
        }, DEBOUNCE_DELAY);

        $rootScope.$watch(size, resizer);
      }
    };
  });
};
