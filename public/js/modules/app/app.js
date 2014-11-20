'use strict';

var $ = require('jquery');
var angular = require('angular');
var ngModule = angular.module('cancer.app',
  [
    'ui.router',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap'
  ])
  .config(function ($httpProvider, $locationProvider) {
    $httpProvider.defaults.useXDomain = true;
    $locationProvider.html5Mode(true);
  });

module.export = ngModule;
