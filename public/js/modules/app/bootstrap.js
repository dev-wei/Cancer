var deferred = require('angular-deferred-bootstrap');

module.exports = function (ngModule) {
  deferred.bootstrap({
    element: window.document.documentElement,
    module: ngModule.name,
    resolve: {
      APP_CONFIG: ['$http', function ($http) {
        return $http({
          method: 'GET',
          url: '/api/config',
          withCredentials : true
        });
      }]
    }
  });
};
