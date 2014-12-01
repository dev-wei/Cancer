'use strict';
module.exports = function (ngModule) {
  var _ = require('lodash');
  ngModule.provider('resize', function () {
    var THROTTLE_DELAY = 500;

    this.$get = function ($window) {
      var window = angular.element($window);

      function on() {
        window.on('resize', function (event) {
          throttle(event);
        });
      }

      function off() {
        window.off('resize');
      }

      var throttle = _.throttle(
        function (event) {
          callbacks.forEach(function(callback){
            callback(event);
          })
        }, THROTTLE_DELAY);

      var callbacks = [];

      var bind = function (callback) {
        if (_.isEmpty(callbacks)) {
          on();
        }
        callbacks.push(callback);
      };

      var unbind = function (callback) {
        var index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
        if (_.isEmpty(callbacks)) {
          off();
        }
      };

      return {
        "bind": bind,
        "unbind": unbind
      };
    };
  });

  ngModule.directive('resize', function ($log, $rootScope, resize) {
    return {
      restrict: 'C',
      scope: false,
      link: function ($scope, $elem, attr) {

        resize.bind(function () {
          $log.info('');

        });

        $scope.$on('$destroy', function () {
          resize.unbind();
        });
      }
    };
  });
};
