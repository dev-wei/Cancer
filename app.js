'use strict';
var config = require('./config/config');

if (config.env === 'local') {
  require('./config/start')();
} else {
  require('./config/cluster')({}, require('./config/start'));
}



