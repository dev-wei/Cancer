/**
 * Created by michael.wei on 12/3/14.
 */
'use strict';
var AjaxProvider = function (ngModule) {
  var _ = require('lodash');
  ngModule.provider('Ajax', function ($http) {
    var self = this;
    self.defaults = {
      urlPattern: '<%=url%>'
    };

    function resolveUrl(url) {
      return _.tempalte(self.defaults.urlPattern, {url: url});
    }

    var Ajax = function () {
      this.get = function (url) {
        return $http.get(resolveUrl(url));
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