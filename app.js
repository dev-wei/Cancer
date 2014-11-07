'use strict';
var config = require('./config/config');

if (config.env === 'local') {

} else {
  require('./config/cluster')();
}



