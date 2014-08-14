/**
 * Module dependencies
 */
var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    passport = require('passport'),
    logger = require('mean-logger'),
    http = require('http'),
    config = require('./config/config'),
    auth = require('./config/middlewares/authorization'),
    mongoose = require('mongoose');

module.exports = function () {
  //Bootstrap db connection
  var db = mongoose.connect(config.db);

  //Bootstrap models
  var models_path = path.join(config.root + '/app/models');
  var walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
      var newPath = path + '/' + file;
      var stat = fs.statSync(newPath);
      if (stat.isFile()) {
        if (/(.*)\.(js$|coffee$)/.test(file)) {
          require(newPath);
        }
      } else if (stat.isDirectory()) {
        walk(newPath);
      }
    });
  };
  walk(models_path);

  //bootstrap passport config
  require('./config/passport')(passport);

  var app = express();

  //express settings
  require('./config/express')(app, passport, db);

  //Bootstrap routes
  require('./config/routes')(app, passport, auth);

  //Start the app by listening on <port>
  var port = process.env.PORT || config.port;

  console.log('Express app started on port ' + port);
  logger.init(app, passport, mongoose);
  var server = app.listen(port);

  var io = require('socket.io').listen(server);

  // Socket.io Communication
  io.sockets.on('connection', require('./config/socket'));

  return app;
};




