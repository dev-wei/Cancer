'use strict';

var $;
var angular;
if (typeof require === 'function') {
  $ = require('jquery');
  angular = require('angular');
}

var ngModule = angular.module('Cancer',
  [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .value('version', $('meta[name=version]').attr('content'))
  .config(function ($httpProvider, $locationProvider) {
    $httpProvider.defaults.useXDomain = true;
    $locationProvider.html5Mode(true);
  })
  .run(function ($animate){
    $animate.enabled(false);
  });

if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = ngModule;
  }
}