var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  env: process.env.NODE_ENV,
  root: rootPath,
  port: process.env.PORT || 3000,
  db: process.env.MONGOHQ_URL,
  modules: {
    "grunt-browserify": path.resolve(rootPath, 'app/modules/grunt-browserify/src/grunt-browserify.js')
  }
};
