'use strict';

var angular = require('angular');
var ngModule = angular.module('cancer.common', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngLocale',
  'cancer.template'
]).value('version', '0.1');

require('./services/configuration')(ngModule);
require('./services/resizer')(ngModule);
require('./controllers/header')(ngModule);
require('./directives/retinaMenu')(ngModule);
require('./factories/httpInterceptor')(ngModule);

module.exports = ngModule;