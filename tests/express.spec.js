'use strict';
var expect = require('expect.js');

describe('Express', function () {
  var express;

  beforeEach(function () {
    express = require('../config/express');
  });

  it('Should have config resolved correctly.', function () {
    expect(express).to.be.ok();
  });

  it('Should have all modules paths.', function () {
  });
});