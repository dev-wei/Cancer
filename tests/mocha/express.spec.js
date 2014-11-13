'use strict';
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require('sinon-chai');

describe('Express', function () {
  var expect = chai.expect;
  chai.use(sinonChai);

  var app = {
    set: function () {
    },
    use: function () {
    },
    enable: function () {
    },
    locals: {}
  };
  var passport = {
    initialize: function () {
    },
    session: function () {
    }
  };

  beforeEach(function () {
  });

  it('Should have config resolved correctly.', function () {
    var express = require('../../config/express')(app, passport);
    expect(express).to.be.ok();
  });
});