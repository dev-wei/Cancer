var cluster = require('cluster'),
    os = require('os'),
    _ = require('underscore'),
    string = require('string'),
    logging = require('./logging'),
    callback = require('../public/js/lib/my_components/callback/src/callback');

module.exports = function (options) {
    'use strict';
    // Constants
    var MASTER = 'MASTER';
    var WORKER = 'WORKER_{{index}}';

    // WorkerListeners, this is used for storing all callbacks for each worker
    var workerListeners = new callback();

    /**
     * Default option
     * @type {{workerCount: *}}
     */
    var defaultsOptions = {
        workerCount : os.cpus().length
    };

    /**
     * Check options
     */
    options = _.extend(defaultsOptions, options);
    (function(options){
        if (typeof options.workerCount !== 'number') {
            throw 'workerCount be a number';
        }
    }(options));

    /**
     * Master function
     */
    var runMaster = function () {

        var logger = logging.getLogger(MASTER);

        logger.debug('Starting master......');

        var workers = [];
        var i;
        for (i = 0; i < options.workerCount; i = i + 1) {
            workers.push(cluster.fork());
        }

        cluster.on('exit', function (worker, code, signal) {
            var workerIdx = workers.indexOf(worker);
            var logger = logging.getLogger(
                string(WORKER).template({'index':cluster.worker.id}).s);

            logger.error(worker.process.pid + ' died with code ' + code);
            logger.info('restarting.....');

            if (workerIdx > -1) {
                workers.splice(workerIdx, 1);
            }

            worker = cluster.fork();
            worker.on('message', function(){
                workerListeners.handle(true);
            });

            return workers.push(worker);
        });

        logger.debug('Ending master......');

        return process.on('SIGQUIT', function () {
            var j, worker, results;
            results = [];

            logger.info('QUIT received, will exit once all workers have finished current requests');
            for (j = 0; j < workers.length; j += 1) {
                worker = workers[j];
                results.push(worker.send('quit'));
            }

            return results;
        });
    };

    var runWorker = function () {
        var logger = logging.getLogger(
            string(WORKER).template({'index':cluster.worker.id}).s);

        logger.debug('Starting worker......');

//        server = loader(workerLogger);
//        if (!server) {
//            return;
//        }
//
//        if (typeof server.on === 'function') {
//            server.on('close', function () {
//                return process.exit();
//            });
//        }
//
//        if (typeof server.close === 'function') {
//            return process.on('message', function (msg) {
//                if (msg === 'quit') {
//                    return server.close();
//                }
//            });
//        }

        logger.debug('Ending worker......');
    };

    if (cluster.isMaster) {
        return runMaster();
    }
    return runWorker();
};