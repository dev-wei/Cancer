'use strict';
var expect = require('expect.js');

describe('Logging', function () {
  var logging;

  beforeEach(function () {
    logging = require('../config/logging');
  });

  it('Should have logging resolved correctly.', function () {
    expect(logging).to.be.ok();
  });

  it('Should be able to get logger by name.', function () {
    expect(logging.getLogger('test')).to.be.ok();
  });

  it('Should be able to get default logger.', function () {
    expect(logging.getDefaultLogger()).to.be.ok();
  });
});