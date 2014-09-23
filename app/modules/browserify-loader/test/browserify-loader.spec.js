'use strict';
var expect = require('expect.js');
var loader = require('../src/browserify-loader.js')();

describe('browserify-loader', function () {

  it('it can not be null', function () {
    expect(loader).to.be.ok();
  });

  it('browser must be loaded from package.json', function () {
    expect(loader.browser).to.be.ok();
  });

  it("browserify-shim must be loaded from package.json", function () {
    expect(loader.browserify_shim).to.be.ok();
  });
});

