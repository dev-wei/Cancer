'use strict';
var AjaxProvider = function (ngModule) {
  var _ = require('lodash');
  ngModule.provider('Ajax', function ($http, $q) {
    var self = this;
    self.defaults = {
      urlPattern: '<%=url%>',
      headers: {
        "Content-Type": 'application/json; charset=utf-8'
      }
    };

    function getUrl(url) {
      return _.tempalte(self.defaults.urlPattern, {url: url});
    }

    var Ajax = function () {
      this.get = function (url) {
        var deferred = $q.defer();

        return $http({
          method: 'GET',
          url: getUrl(url),
          headers: self.defaults.headers
        })
          .success(function (data) {

          })
          .error(function (error, status) {
            deferred.reject({"error": 'error is:' + error + ', status is:' + status});
          });
        ;
      };

      this.call = function (option) {
        return $http(option);
      };
    };

    self.$get = function () {
      return new Ajax();
    };
  });
};

module.exports = AjaxProvider;