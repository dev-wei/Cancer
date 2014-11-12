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

  var db = mongoose.connect(config.db);
  mongoose.connection.on('error', function () {
    logger.error('Could not connect to Mongodb!', config.db);
  });
  mongoose.connection.once('open', function () {
    logger.info('Successfully connected to Mongodb!', config.db);
  });

  require('./models');

  require('./passport')(passport);

  var app = require('express')();
  require('./express')(app, passport, db);

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




