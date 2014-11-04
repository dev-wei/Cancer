'use strict';
var expect = require('expect.js');
var Browserify = require('../src/grunt-browserify.js');

describe('grunt-browserify', function () {

  var browser = {
    "jquery": "./public/js/lib/jquery-2.1.1.js",
    "jquery-ui": "./public/js/lib/jquery-ui-1.11.1/jquery-ui.js",
    "jquery-event-drag": "./public/js/lib/jquery.event.drag-2.2/jquery.event.drag-2.2.js",
    "bytebuffer": "bytebuffer"
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
    var browserify = new Browserify(browser, shims);
    expect(browserify.getConfig()).to.eql({
      exclude: ['jquery', 'jquery-ui', 'jquery-event-drag', 'bytebuffer'],
      source: ['./public/js/lib/jquery-ui-1.11.1/jquery-ui.js',
        './public/js/lib/jquery.event.drag-2.2/jquery.event.drag-2.2.js'],
      require: ['jquery', 'bytebuffer']
    });
  });

  it('it should generate browserfy command.', function () {
    var browserify = new Browserify(browser, shims);
    expect(browserify.getCmd(false, './public/build/libs.js')).to.eql("node node_modules/browserify/bin/cmd.js --debug ./public/js/lib/jquery-ui-1.11.1/jquery-ui.js ./public/js/lib/jquery.event.drag-2.2/jquery.event.drag-2.2.js -r jquery -r bytebuffer -o ./public/build/libs.js");
  });

});

