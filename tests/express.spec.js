'use strict';
var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require('sinon-chai');

describe('Express', function () {
  var expect = chai.expect;
  chai.use(sinonChai);

  var express;
  var port = 1000;
  var app = {
    set: function () {
    },
    use: function () {
    },
    enable: function () {
    },
    locals: {}
  };
  var logger = {};
  var passport = {
    initialize: function () {
    },
    session: function () {
    }
  };
  var http = {
    createServer: function () {
      return {
        listen: function (port, callback) {
        }
      };
    }
  };

  beforeEach(function () {
  });

  it('Should have config resolved correctly.', function () {
    express = require('../config/express')(logger, port, app, passport, http);
    expect(express).to.be.ok();
  });
});