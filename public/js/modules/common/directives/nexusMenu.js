'use strict';
module.exports = function (ngModule) {
  ngModule.directive('nexusMenu', function ($templateCache, $log, Utility) {
    return {
      restrict: 'C',
      scope: {
        dataItems: '='
      },
      controller: function ($scope) {
        $scope.isIconMenuVisible = false;
        $scope.isMenuVisible = false;
      },
      template: $templateCache.get('nexusMenu'),
      link: function ($scope, element, attributes, ctrl) {
        var eventType = Utility.isMobile() ? 'touchstart' : 'click';
        var body = $(document.body);
        var menu = $(element).find('a.gn-icon-menu');

        menu.on(eventType, function () {
          $scope.$evalAsync(function () {
            $scope.isMenuVisible = true;
          });
        });

        $scope.$watch('isMenuVisible', function (newValue) {
          if (newValue) {
            var closeMenu = function () {
              $scope.$evalAsync(function () {
                $scope.isMenuVisible = false;
              });
              body.off(eventType, closeMenu);
            }
            body.on(eventType, closeMenu);
          }
        }, true);
      }
    };
  });
};