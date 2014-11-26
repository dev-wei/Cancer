'use strict';
var config = require('./config/config');

if (config.env === 'local') {
  require('./config/startup')();
} else {
  require('./config/cluster')({}, require('./config/startup'));
}



