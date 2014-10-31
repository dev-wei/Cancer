'use strict';

var _ = require('lodash');
var path = require('path');
var browserify = require('./app/modules/grunt-browserify/src/grunt-browserify');

module.exports = function (grunt) {

  var
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
    sources: {
      js: 'public/js/modules/**/*.js',
      jade: 'views/**/*.jade',
      css: ['public/css/*.css'],
      test: 'test/**/*.js'
    },
    paths: {
      js: 'public/js/modules',
      build: 'public/js/build',
      css: 'public/css',
      cssBuild: 'public/css/build'
    }
  };

  // configure the tasks
  grunt.initConfig({
    "pkg": pkg,
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