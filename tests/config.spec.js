'use strict';
var expect = require('expect.js');
var path = require('path');

describe('config', function () {
  var config;

  beforeEach(function () {
    config = require(path.join(
      __dirname, '../config/config'));
  });

  it('it can not be null', function () {
    expect(config).to.be.ok();
  });

  it('it can not be null', function () {
    expect(config.modules).to.be.ok();
    expect(config.modules['grunt-browserify']).to.be.ok();
    expect(require(config.modules['grunt-browserify'])).to.be.ok();
  });
});