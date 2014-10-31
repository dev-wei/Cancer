'use strict';
var expect = require('expect.js');
var browserify = require('../src/grunt-browserify.js');

describe('grunt-browserify', function () {

  it('it can not be null', function () {
    expect(browserify).to.be.ok();
  });

});

