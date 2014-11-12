'use strict';
var expect = require('expect.js');
var Browserify = require('../src/grunt-browserify.js');

describe('grunt-browserify', function () {

  var browser_sources = {
    "jquery": "./bower_components/jquery/dist/jquery.js",
    "angular": "./bower_components/angular/angular.js"
  };

  var browser = {
    "jquery": "./public/js/lib/jquery-2.1.1.js",
    "jquery-ui": "./public/js/lib/jquery-ui-1.11.1/jquery-ui.js",
    "jquery-event-drag": "./public/js/lib/jquery.event.drag-2.2/jquery.event.drag-2.2.js"
  };

  var shims = {
    "jquery": "$",
    "jquery-ui": {
      "exports": null,
      "depends": [
        "jquery:$"
      ]
    },
    "jquery-event-drag": {
      "exports": null,
      "depends": [
        "jquery:$"
      ]
    }
  };

  it('it can not be null.', function () {
    expect(Browserify).to.be.ok();
    expect(new Browserify({}, {})).to.be.ok();
  });

  it('it should transform the config into a specified formation.', function () {
    var browserify = new Browserify(browser_sources, browser, shims);
    expect(browserify.getConfig()).to.eql({
      exclude: ['jquery', 'jquery-ui', 'jquery-event-drag'],
      source: ['./public/js/lib/jquery-ui-1.11.1/jquery-ui.js',
        './public/js/lib/jquery.event.drag-2.2/jquery.event.drag-2.2.js'],
      require: ['jquery']
    });
  });

  it('it should get a list of files of sources.', function () {
    var browserify = new Browserify(browser_sources, browser, shims);
    expect(browserify.getBrowserSourceFiles()).to.eql([ './bower_components/jquery/dist/jquery.js',
      './bower_components/angular/angular.js' ]);
  });

  it('it should generate browserfy command for libs.js.', function () {
    var browserify = new Browserify(browser_sources, browser, shims);
    expect(browserify.getCmd(false, './public/build/libs.js'))
      .to.eql("node node_modules/browserify/bin/cmd.js --debug ./public/js/lib/jquery-ui-1.11.1/jquery-ui.js ./public/js/lib/jquery.event.drag-2.2/jquery.event.drag-2.2.js -r jquery -o ./public/build/libs.js");
  });

  it('it should generate browserfy command for app.js.', function () {
    var browserify = new Browserify(browser_sources, browser, shims);
    expect(browserify.getCmd(true, './public/build/app.js', ['./public/app/app.js']))
      .to.eql("node node_modules/browserify/bin/cmd.js --debug ./public/app/app.js -x jquery -x jquery-ui -x jquery-event-drag -o ./public/build/app.js");
  });

  it('it should generate browserfy command for app.js with code coverage.', function () {
    var browserify = new Browserify(browser_sources, browser, shims);
    expect(browserify.getCmd(true, './public/build/app.coverage.js', ['./public/app/app.js'], ['-t browserify-istanbul']))
      .to.eql("node node_modules/browserify/bin/cmd.js --debug ./public/app/app.js -x jquery -x jquery-ui -x jquery-event-drag -o ./public/build/app.coverage.js -t browserify-istanbul");
  });
});

