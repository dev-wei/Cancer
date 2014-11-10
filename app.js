'use strict';
var config = require('./config/config');

if (config.env === 'local') {
  require('./config/express')();
} else {
  require('./config/cluster')({}, require('./config/express'));
}



