/**
 * Module dependencies
 */
var express = require('express'),
  path = require('path'),
  passport = require('passport'),
  http = require('http'),
  config = require('./config'),
//auth = require('./config/middlewares/authorization'),
  mongoose = require('mongoose');

module.exports = function (logger, http) {
  if (!logger) {
    logger = require('./logging').getDefaultLogger();
  }

  if (!http) {
    http = require('http');
  }

  //Bootstrap db connection
  var db = mongoose.connect(config.db);
  mongoose.connection.on('error', function () {
    logger.error('Could not connect to Mongodb!', config.db);
  });
  mongoose.connection.once('open', function () {
    logger.info('Successfully connected to Mongodb!', config.db);
  });

  //Bootstrap models
  //var models_path = path.join(config.root + '/app/models');
  //var walk = function (path) {
  //  fs.readdirSync(path).forEach(function (file) {
  //    var newPath = path + '/' + file;
  //    var stat = fs.statSync(newPath);
  //    if (stat.isFile()) {
  //      if (/(.*)\.(js$|coffee$)/.test(file)) {
  //        require(newPath);
  //      }
  //    } else if (stat.isDirectory()) {
  //      walk(newPath);
  //    }
  //  });
  //};
  //walk(models_path);

  //bootstrap passport config
  //require('./config/passport')(passport);

  var app = express();

  //express settings
  require('./express')(app, passport);

  //Bootstrap routes
  //require('./config/routes')(app, passport, auth);

  //Start the app by listening on <port>
  var port = process.env.PORT || config.port;
  var server = http.createServer(app).listen(port,
    function () {
      logger.info('Project is listening on port: ' + server.address().port);
    });

  //var io = require('socket.io').listen(server);
  // Socket.io Communication
  //io.sockets.on('connection', require('./config/socket'));

  return app;
};




