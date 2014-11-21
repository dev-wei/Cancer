'use strict';

var angular = require('angular');
var ngModule = angular.module('cancer.common', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngLocale',
  'cancer.template'
]).value('version', '0.1');

require('./directives/retinaMenu')(ngModule);

module.exports = ngModule;