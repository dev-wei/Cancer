'use strict';

var _ = require('lodash');
var path = require('path');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-forever');

  // package json
  var pkg = grunt.file.readJSON('package.json');

  // configuration shared across all tasks
  var configs = {
    "sources": {
      "js": 'public/js/modules/**/*.js',
      "jade": 'views/**/*.jade',
      "test": 'test/**/*.js'
    },
    "paths": {
      "js": 'public/js/modules',
      "build": 'public/js/build'
    }
  };

  var browserify = function () {
    var getConfig = function () {
      var dependencies = {
        exclude: _.keys(pkg.browser)
      };

      var exportless = function (shim) {
        return !_.isString(shim) && _.isEmpty(shim.exports);
      };

      var isNRAlias = function (val, key) {
        return _.contains(weaklyShimmed, key);
      };

      var shims = pkg['browserify-shim'];
      var weaklyShimmed = _(shims).pick(exportless).keys().value();
      dependencies.source = _(pkg.browser).pick(weaklyShimmed).values().value();
      dependencies.require = _(pkg.browser).omit(isNRAlias).keys().value();

      return dependencies;
    };

    var getCmd = function (isApp, dest, source) {
      var includeDep = function (key) {
        return [dependenciesFlag, key];
      };

      var dependencies = getConfig();
      var dependenciesFlag = (isApp ? '-x' : '-r');
      var src = isApp ? source : dependencies.source;
      var includes = _.map((
              isApp ? dependencies.exclude : dependencies.require),
          includeDep);

      var cmd = _([
        'node',
        'node_modules/browserify/bin/cmd.js',
        '--debug',
        src, includes, '-o', dest
      ]).flatten().compact().join(' ');

      return cmd;
    };

    return {
      "getCmd": getCmd
    };
  }();

  grunt.log.debug(JSON.stringify(configs));

  // configure the tasks
  grunt.initConfig({
    "pkg" : pkg,
    "configs": configs,

    // external browserify (package.json) avoiding grunt-browserify issues
    "run": {
      "options": {
        "failOnError": true,
        "cwd": __dirname
      },
      "browserify-libs": {
        "exec": browserify.getCmd(false, './<%= configs.paths.build %>/libs.js')
      },
      "browserify-app": {
        "exec": browserify.getCmd(true, './<%= configs.paths.build %>/app.js', ['./<%= configs.paths.js %>/app/app.js'])
      }
    },

    "copy": {
      "build": {
        "expand": true,
        "src": [ '**' ],
        "dest": 'build'
      }
    },

    "mkdir": {
      "all": {
        "options": {
          "create": [ configs.paths.build ]
        }
      }
    },

    "jshint": {
      "options": {
        "jshintrc": true
      },
      "all": {
        "src": [
          configs.sources.js,
          configs.sources.test
        ]
      }
    },

    "karma": {
      "options": {
        "configFile": 'karma.conf.js'
      },
      "unit": {
        "singleRun": true
      },
      "watch": {
        "options": {
          "reporters": ['progress']
        },
        "autoWatch": false,
        "singleRun": false,
        "background": true
      }
    },

    "mochaTest": {
      "test": {
        "options": {
          "reporter": 'spec'
        },
        "src": []
      }
    },

    "watch": {
      "build": {
        "files": [configs.sources.js],
        "tasks": ['run:browserify-app', 'karma:watch:run']
      },
      "karma": {
        "files": [configs.sources.test],
        "tasks": ['karma:watch:run']
      }
    },

    "forever": {
      "server": {
        "options": {
          "index": 'app.js',
          "logDir": 'logs'
        }
      }
    },

    "clean": {
      "all": {
        "src": configs.paths.build
      },
      "libs": {
        "src": path.join(configs.paths.build, 'libs.js')
      },
      "app": {
        "src": path.join(configs.paths.build, 'app.js')
      }
    }
  });

  // Tasks
  grunt.registerTask(
      'default',
      ['clean:all']);

  grunt.registerTask(
      'build', 'Default build which generates the app bundle.',
      'build:app');

  grunt.registerTask(
      'build:app',
      ['mkdir:all', 'run:browserify-app']);

  grunt.registerTask(
      'build:libs',
      ['mkdir:all', 'run:browserify-libs']);

  grunt.registerTask(
      'build:all',
      ['mkdir:all', 'run:browserify-libs', 'run:browserify-app']);

  grunt.registerTask(
      'test',
      'Runs mocha (integration) and karma (unit) tests',
      ['karma:unit', 'mochaTest']);

  grunt.registerTask(
      'dev',
      'Serves a dev server and bundles/tests/lints when files change.',
      ['build', 'karma:watch:start', 'watch']);
};