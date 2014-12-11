'use strict';

var angular = require('angular');
var ngModule = angular.module('cancer.common', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngLocale',
  'cancer.template'
]).value('version', '0.1');

require('./providers/ajax')(ngModule);
require('./services/configuration')(ngModule);
require('./services/resizer')(ngModule);
require('./services/utility')(ngModule);
require('./controllers/header')(ngModule);
require('./directives/retinaMenu')(ngModule);
require('./directives/nexusMenu')(ngModule);

module.exports = ngModule;