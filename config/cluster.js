'use strict';

var cluster = require('cluster');
var os = require('os');
var _ = require('lodash');
var string = require('string');
var logging = require('./logging');

module.exports = function (options, workerLoader) {

  var MASTER = 'MASTER';
  var WORKER = _.template('WORKER_<%=index%>');

  var defaultsOptions = {
    workerCount: os.cpus().length
  };

  options = _.extend(defaultsOptions, options);
  (function (options) {
    if (typeof options.workerCount !== 'number') {
      throw 'workerCount be a number';
    }
  }(options));

  var runMaster = function () {
    var logger = logging.getLogger(MASTER);
    logger.debug('Starting MASTER......');

    var workers = [];
    for (var i = 0; i < options.workerCount; i = i + 1) {
      workers.push(cluster.fork());
    }

    cluster.on('exit', function (worker, code) {
      var workerIdx = workers.indexOf(worker);
      var logger = logging.getLogger(
        WORKER({"index": cluster.worker.id}));

      logger.warning(worker.process.pid + ' died with code ' + code);
      logger.info('Restarting.....');

      if (workerIdx > -1) {
        workers.splice(workerIdx, 1);
      }

      worker = cluster.fork();
      return workers.push(worker);
    });

    logger.debug('Ending MASTER......');
    process.on('SIGQUIT', function () {
      var results = [];

      logger.info('QUIT received, will exit once all workers have finished current requests');
      for (var j = 0; j < workers.length; j += 1) {
        var worker = workers[j];
        results.push(worker.send('quit'));
      }
      return results;
    });

    return logger;
  };

  var runWorker = function () {
    var logger = logging.getLogger(
      WORKER({"index": cluster.worker.id}));
    logger.debug('Starting Worker......');

    workerLoader(logger);

    logger.debug('Ending Worker......');
    return logger;
  };

  if (cluster.isMaster) {
    return runMaster();
  }
  return runWorker(workerLoader);
};