'use strict';
var AjaxProvider = function (ngModule) {
  var _ = require('lodash');
  ngModule.provider('Ajax', function () {
    var self = this;
    self.defaults = {
      HTTP_NETWORK_TIMEOUT: 5000,
      urlPattern: '<%=url%>',
      errorPattern: 'Ajax call "<%=url>" returns error: <%=error>, httpStatus: <%=status>',
      timeoutPattern: 'Ajax call "<%=url>" has timed out.',
      headers: {
        "Content-Type": 'application/json; charset=utf-8'
      }
    };

    function getUrl(url) {
      return _.template(self.defaults.urlPattern, {url: url});
    }

    function getError(url, error, status) {
      return _.template(self.defaults.errorPattern, {url: url, error: error, status: status});
    }

    function getTimeout(url) {
      return _.template(self.defaults.timeoutPattern, {url: url});
    }

    var Ajax = function ($http, $q, $log, $timeout) {
      function call(request) {
        var deferred = $q.defer();
        $http(request)
          .success(function (data) {
            if ('return' in data) {
              deferred.resolve(data.return);
            }
          })
          .error(function (error, status) {
            $log.error(error, status);
            deferred.reject(getError(request.url, error, status));
          });

        $timeout(function () {
          $log.error('timeout');
          deferred.reject(getTimeout(request.url));
        }, self.defaults.HTTP_NETWORK_TIMEOUT);

        return deferred.promise;
      }

      this.get = function (url) {
        return call({
          method: 'GET',
          url: getUrl(url),
          headers: self.defaults.headers
        });
      };

      this.call = function (option) {
        option.headers = _.defaults(self.defaults.headers, option.headers);
        option.url = getUrl(option.url);
        return call(option);
      };

      this.api = {
        MENU: 'api/menu'
      };
    };

    self.$get = function ($http, $q, $log, $timeout) {
      return new Ajax($http, $q, $log, $timeout);
    };
  });
};

module.exports = AjaxProvider;