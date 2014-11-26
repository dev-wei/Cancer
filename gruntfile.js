'use strict';

var _ = require('lodash');
var path = require('path');
var config = require('./config/config');
var GruntBrowserify = require(config.modules['grunt-browserify']);

module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-run');
  grunt.loadNpmTasks('grunt-forever');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-html2js');

  // package json
  var pkg = grunt.file.readJSON('package.json');

  var browserify = new GruntBrowserify(
      pkg.sources,
      pkg.browser,
      pkg['browserify-shim']);

  var toMochaTest = function (files) {
    return _.map(files, function (file) {
      return file.folder + "/**/" + file.mask;
    });
  };

  var toMochaIstanbul = function (files) {
    return _.map(files, function (file) {
      return file.folder;
    });
  };

  var configs = {
    "sources": {
      "js": 'public/js/modules/**/*.js',
      "jade": 'views/**/*.jade',
      "css": ['public/css/*.css'],
      "test": [
        {
          "folder": 'tests/mocha',
          "mask": '*.spec.*'
        },
        {
          "folder": 'app/modules/grunt-browserify',
          "mask": '*.spec.*'
        },
        {
          "folder": 'app/modules/smart-forEach',
          "mask": '*.spec.*'
        }
      ]
    },
    "paths": {
      "jsLibs": 'build',
      "js": 'public/js/modules',
      "build": 'public/js/build',
      "css": 'public/css',
      "cssBuild": 'public/css',
      "target": 'target',
      "coverage": 'coverage'
    }
  };

  //grunt.log.debug(JSON.stringify(toMochaTest(configs.sources.test)));

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
      "browserify-tpl": {
        "exec": browserify.getCmd(true, './<%= configs.paths.build %>/tpl.js', ['./<%= configs.paths.build %>/tpl.raw.js'])
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
          "create": [configs.paths.build]
        }
      }
    },
    "copy": {
      "browserify": {
        "expand": true,
        "flatten": true,
        "src": browserify.getBrowserSourceFiles(),
        "dest": configs.paths.jsLibs
      },
      "build": {
        "expand": true,
        "src": ['*.js', 'package.json', 'app/**/*.*', 'config/**/*.*', 'public/**/*.*'],
        "dest": configs.paths.target
      },
      "font-awesome": {
        "expand": true,
        "cwd": 'bower_components/fontawesome',
        "src": ['fonts/**'],
        "dest": configs.paths.cssBuild
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
      options: {
        configFile: 'config/karma.conf.js',
        singleRun: true
      },
      unit: {
        options: {
          singleRun: true,
          files: [
            'public/js/lib/browser-source-map-support.js',
            'public/js/build/libs.js',
            'public/js/build/tpl.js',
            'public/js/build/app.js',

            'bower_components/angular-mocks/angular-mocks.js',
            'tests/karma/**/*.spec.js'
          ],
          browsers: ['PhantomJS']
        }
      },
      coverage: {
        options: {
          singleRun: true,
          reporters: ['progress', 'teamcity', 'coverage'],
          files: [
            'public/js/lib/browser-source-map-support.js',
            'public/js/build/libs.js',
            'public/js/build/tpl.js',
            'public/js/build/app.coverage.js',

            'bower_components/angular-mocks/angular-mocks.js',
            'tests/karma/**/*.spec.js'
          ],
          browsers: ['PhantomJS']
        }
      },
      watch: {
        autoWatch: false,
        singleRun: false,
        background: true
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
      },
      "build": {
        "src": configs.paths.target
      },
      "coverage": {
        "src": configs.paths.coverage
      },
      "css": {
        "src": [path.join(configs.paths.build, 'app.css'), 'fonts']
      }
    },
    "uglify": {
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
    "mocha_istanbul": {
      coverage: {
        src: toMochaIstanbul(configs.sources.test),
        options: {
          mask: '**/*.spec.js',
          reportFormats: ['teamcity', 'html', 'text']
        }
      }
    },
    "less": {
      dist: {
        options: {
          compress: true,
          cleancss: true,
          banner: '/* Generated at <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
        },
        files: {
          '<%= configs.paths.cssBuild %>/app.css': '<%= configs.paths.css %>/build.less'
        }
      },
      dev: {
        options: {
          compress: false,
          cleancss: false,
          banner: '/* Generated at <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n'
        },
        files: {
          '<%= configs.paths.cssBuild %>/app.css': '<%= configs.paths.css %>/build.less'
        }
      }
    },
    "html2js": {
      options: {
        module: 'cancer.template',
        useStrict: true,
        rename: function (moduleName) {
          return path.basename(moduleName).replace('.jade', '');
        },
        singleModule: true
      },
      main: {
        src: ['public/js/**/*.jade'],
        dest: 'public/js/build/tpl.raw.js'
      }
    }
  });

  grunt.registerTask('build:css', 'build theme',
      function () {
        var isValidTheme =
            grunt.file.exists(configs.paths.css, 'variables.less') &&
            grunt.file.exists(configs.paths.css, 'build.less') &&
            grunt.file.exists(configs.paths.css, 'app.less');

        if (!isValidTheme) {
          grunt.log.error('Theme files are missing.');
        }

        grunt.task.run(['clean:css', 'copy:font-awesome', 'less:dev']);
      });

  // Tasks
  grunt.registerTask(
      'default',
      ['build']);

  grunt.registerTask(
      'build:app',
      ['mkdir:all', 'copy:browserify', 'run:browserify-app', 'clean:browserify']);

  grunt.registerTask(
      'build:tpl',
      ['mkdir:all', 'html2js:main', 'run:browserify-tpl']);

  grunt.registerTask(
      'build:libs',
      ['mkdir:all', 'copy:browserify', 'run:browserify-libs', 'clean:browserify']);

  grunt.registerTask(
      'build:app-coverage',
      ['mkdir:all', 'copy:browserify', 'run:browserify-app-coverage', 'clean:browserify']);

  grunt.registerTask(
      'build:coverage',
      ['build:app-coverage']);

  grunt.registerTask(
      'dev',
      ['clean:build', 'build:tpl', 'build:app', 'build:css', 'copy:build']);

  grunt.registerTask(
      'build',
      ['clean:build', 'build:tpl', 'build:app', 'uglify:app', 'uglify:libs', 'build:css', 'copy:build']);

  grunt.registerTask(
      'test',
      ['mochaTest:test', 'karma:unit']);

  grunt.registerTask(
      'node:coverage',
      ['clean:coverage', 'mochaTest:test', 'mocha_istanbul']);

  grunt.registerTask(
      'ui:coverage',
      ['clean:coverage', 'karma:coverage']);

  grunt.registerTask(
      'buddy',
      ['build:libs', 'build', 'test', 'node:coverage', 'ui:coverage', 'clean:build']);
};