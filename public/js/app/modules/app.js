'use strict';

var angular;
if(typeof require === 'function'){
  angular = require('angular');
}

angular.module('Cancer', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'ui.route'
]);

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = null;
  }
}