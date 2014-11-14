'use strict';
module.exports = function (config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],
    plugins: [
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-teamcity-reporter'
    ],
    files: [
      'public/js/lib/browser-source-map-support.js',
      'public/js/build/libs.js',
      'public/js/build/app.js',

      'bower_components/angular-mocks/angular-mocks.js',
      'tests/karma/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'public/js/build/libs.js': ['sourcemap'],
      'public/js/build/app.js': ['sourcemap'],
      'public/js/build/app.coverage.js': ['sourcemap']
    },
    reporters: ['progress', 'teamcity'],
    coverageReporter: {
      reporters: [
        {type: 'teamcity'},
        {type: 'html'},
        {type: 'text'}
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
