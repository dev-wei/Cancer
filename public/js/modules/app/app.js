'use strict';

var $ = require('jquery');
var modernizr = require('modernizr');
var angular = require('angular');
var ngModule = angular.module('cancer.app',
  [
    'ui.router',
    'ngResource',
    'ngSanitize',
    'ui.bootstrap',
    require('../common').name,
    require('../graph').name
  ])
  .config(function ($httpProvider, $locationProvider) {
    $httpProvider.defaults.useXDomain = true;

    $locationProvider.html5Mode(true);
  });

require('./bootstrap')(ngModule);

module.export = ngModule;
