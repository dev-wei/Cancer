'use strict';

var angular = require('angular');
var ngModule = angular.module('cancer.graph', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngLocale',
  'cancer.template',
  require('../common').name
]).value('version', '0.1');

module.exports = ngModule;