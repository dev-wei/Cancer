'use strict';
module.exports = function (ngModule) {

  var _ = require('lodash');

  ngModule.directive('Resizer', function () {

    return {
      restrict: 'C',
      scope: false,
      link: function (elem) {
        //function size() {
        //  return elem.outerHeight() + 'x' + elem.outerWidth();
        //}
        //
        //var resizer = _.debounce(function resizer(newVal) {
        //  // checking visibility becasue when switching tabs, elements 'shrink', which we don't want
        //  if (newVal !== '0x0' && element.is(':visible')) {
        //    fn();
        //  }
        //}, DEBOUNCE_DELAY);
        //
        //$rootScope.$watch(size, resizer);
      }
    };
  });
};
