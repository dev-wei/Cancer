'use strict';
var path = require('path'),
  passport = require('passport'),
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
  require('./models');

  //bootstrap passport config
  //require('./config/passport')(passport);

  var app = require('express')();
  require('./express')(app, passport, db);

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




