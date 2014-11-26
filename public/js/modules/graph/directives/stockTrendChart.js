'use strict';
module.exports = function (ngModule) {

  var _ = require('lodash');

  ngModule.directive('StockTrendChart', function () {

    function StockTrendChart(element) {

    }

    return {
      restrict: 'C',
      scope: {
        data: '='
      },
      link: function ($scope, elem) {
        var chart = new StockTrendChart(elem);

        (function () {

        })();
      }
    };
  });
};
