'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('./config/config');
var GruntBrowserify = require(config.modules['grunt-browserify']);

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-forever');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  // package json
  var pkg = grunt.file.readJSON('package.json');

  var browserify = new GruntBrowserify(
    pkg['browser-sources'],
    pkg.browser,
    pkg['browserify-shim']);

  var toMochaTest = function (files) {
    return _.map(files, function (file) {
      return file.folder + "/**/" + file.mask;
    })
  };

  var toMochaIstanbul = function (files) {
    return _.map(files, function (file) {
      return file.folder;
    })
  };

  var configs = {
    "sources": {
      "js": 'public/js/modules/**/*.js',
      "jade": 'views/**/*.jade',
      "css": ['public/css/*.css'],
      "test": [
        {
          "folder": 'tests',
          "mask": '*.spec.*'
        },
        {
          "folder": 'app/modules/grunt-browserify',
          "mask": '*.spec.*'
        }
      ]
    },
    "paths": {
      "jsLibs" : 'js',
      "js": 'public/js/modules',
      "build": 'public/js/build',
      "css": 'public/css',
      "cssBuild": 'public/css/build'
    }
  };

  grunt.log.debug(JSON.stringify(toMochaTest(configs.sources.test)));
  // configure the tasks
  grunt.initConfig({
    "pkg": pkg,
    "configs": configs,

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
      },
      "browserify-app-coverage": {
        "exec": browserify.getCmd(true, './<%= configs.paths.build %>/app.coverage.js', ['./<%= configs.paths.js %>/app/app.js'], ['-t browserify-istanbul'])
      }
    },

    "mkdir": {
      "all": {
        "options": {
          "create": [configs.paths.build, configs.paths.jsLibs]
        }
      }
    },

    "copy": {
      "browserify": {
        "expand": true,
        "flatten": true,
        "src": browserify.getBrowserSourceFiles(),
        "dest": configs.paths.jsLibs
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
        "configFile": 'karma.conf.js',
        "singleRun": true
      },
      "unit": {
        "singleRun": true
      },
      "watch": {
        "autoWatch": false,
        "singleRun": false,
        "background": true
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
      },
      "browserify": {
        "src": configs.paths.jsLibs
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      app: {
        options: {
          sourceMap: true,
          sourceMapName: './<%= configs.paths.build %>/app.map'
        },
        files: {
          "./<%= configs.paths.build %>/app.min.js": ['./<%= configs.paths.build %>/app.js']
        }
      },
      libs: {
        files: {
          "./<%= configs.paths.build %>/libs.min.js": ['./<%= configs.paths.build %>/libs.js']
        }
      }
    },

    "mochaTest": {
      "test": {
        "options": {
          "reporter": 'mocha-teamcity-reporter',
          "quiet": false
        },
        "src": toMochaTest(configs.sources.test)
      }
    },

    mocha_istanbul: {
      coverage: {
        src: toMochaIstanbul(configs.sources.test),
        options: {
          mask: '**/*.spec.js',
          reportFormats: ['teamcity', 'html', 'text']
        }
      }
    }
  });

  // Tasks
  grunt.registerTask(
    'default',
    ['build']);

  grunt.registerTask(
    'build:app',
    ['mkdir:all', 'run:browserify-app']);

  grunt.registerTask(
    'build:libs',
    ['mkdir:all', 'copy:browserify', 'run:browserify-libs', 'clean:browserify']);

  grunt.registerTask(
    'build:coverage',
    ['build:libs', 'run:browserify-app-coverage']);

  grunt.registerTask(
    'build',
    ['build:libs', 'run:browserify-app', 'uglify:app', 'uglify:libs']);

  grunt.registerTask(
    'test',
    ['mochaTest:test']);

  grunt.registerTask(
    'test:coverage',
    ['mocha_istanbul']);
};