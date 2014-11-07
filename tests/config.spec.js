'use strict';
var expect = require('expect.js');

describe('Configuration', function () {
  var config;

  beforeEach(function () {
    config = require('../config/config');
  });

  it('Should have config resolved correctly.', function () {
    expect(config).to.be.ok();
  });

  it('Should have all modules paths.', function () {
    expect(config.modules).to.be.ok();
    expect(config.modules['grunt-browserify']).to.be.ok();
    expect(require(config.modules['grunt-browserify'])).to.be.ok();
  });
});