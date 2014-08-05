var cluster = require('cluster'),
    os = require('os'),
    _ = require('underscore');

module.exports = function (options, loggerFactory, workerCount, workerListener) {
    'use strict';

    var defaults = {

        loaders : []

    };

    if (!workerCount) {
        workerCount = os.cpus().length;
    }

    var runMaster = function () {
        var i, workers, masterLogger;
        workers = [];
        masterLogger = loggerFactory.getLogger('Master');

        for (i = 0; i < workerCount; i = i + 1) {
            workers.push(cluster.fork());
        }

        cluster.on('exit', function (worker, code, signal) {
            var workerIdx, logger;
            workerIdx = workers.indexOf(worker);

            logger = loggerFactory.getLogger('Worker_' + workerIdx);
            logger.error(worker.process.pid + ' died with code ' + code);
            logger.info('restarting');

            if (workerIdx > -1) {
                workers.splice(workerIdx, 1);
            }

            worker = cluster.fork();
            if (workerListener) {
                worker.on('message', workerListener);
            }

            return workers.push(worker);
        });

        return process.on('SIGQUIT', function () {
            var j, worker, results;
            results = [];

            masterLogger.info('QUIT received, will exit once all workers have finished current requests');
            for (j = 0; j < workers.length; j += 1) {
                worker = workers[j];
                results.push(worker.send('quit'));
            }

            return results;
        });
    };

    var runWorker = function () {
        var server, workerLogger;

        workerLogger = loggerFactory.getLogger('Worker_' + cluster.worker.id);

        server = loader(workerLogger);
        if (!server) {
            return;
        }

        if (typeof server.on === 'function') {
            server.on('close', function () {
                return process.exit();
            });
        }

        if (typeof server.close === 'function') {
            return process.on('message', function (msg) {
                if (msg === 'quit') {
                    return server.close();
                }
            });
        }
    };

    if (cluster.isMaster) {
        return runMaster();
    }
    return runWorker();
};