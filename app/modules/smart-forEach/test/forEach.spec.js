'use strict';
var _ = require('lodash');
var expect = require('expect.js');
var forEach = require('../src/forEach.js').forEach;

describe('Foreach test suite', function () {
  var order, track;

  beforeEach(function () {
    order = [];
    track = function () {
      [].push.apply(order, arguments);
    };
  });

  it('Synchronous', function () {
    var arr = ['a', 'b', 'c'];
    forEach(arr, function (item, index, arr) {
      track('each', item, index, arr);
    });

    expect(order).to.be.eql(order, [
      'each', 'a', 0, arr,
      'each', 'b', 1, arr,
      'each', 'c', 2, arr
    ], 'should call eachFn for each array item, in order.');
  });

  it('Synchronous, done', function () {
    var arr = ['a', 'b', 'c'];
    forEach(arr, function (item, index, arr) {
      track('each', item, index, arr);
    }, function (notAborted, arr) {
      track('done', notAborted, arr);
    });

    expect(order).to.be.eql(order, [
      'each', 'a', 0, arr,
      'each', 'b', 1, arr,
      'each', 'c', 2, arr,
      'done', true, arr
    ], 'should call eachFn for each array item, in order, followed by doneFn.');
  });

  it('Synchronous, early abort', function () {
    var arr = ['a', 'b', 'c'];
    forEach(arr, function (item, index, arr) {
      track('each', item, index, arr);
      if (item === 'b') {
        return false;
      }
    }, function (notAborted, arr) {
      track('done', notAborted, arr);
    });

    expect(order).to.be.eql(order, [
      'each', 'a', 0, arr,
      'each', 'b', 1, arr,
      'done', true, arr
    ], 'should call eachFn for each array item, in order, followed by doneFn.');
  });

  it('Asynchronous', function () {
    var arr = ['a', 'b', 'c'];
    forEach(arr, function (item, index, arr) {
      track('each', item, index, arr);
      var done = this.async();
      setTimeout(done, 10);
    }, function (notAborted, arr) {
      track('done', notAborted, arr);
    });

    expect(order).to.be.eql(order, [
      'each', 'a', 0, arr,
      'each', 'b', 1, arr,
      'each', 'c', 2, arr,
      'done', true, arr
    ], 'should call eachFn for each array item, in order.');
  });

  it('Asynchronous, early abort', function () {
    var arr = ['a', 'b', 'c'];
    forEach(arr, function (item, index, arr) {
      track('each', item, index, arr);
      var done = this.async();
      setTimeout(function () {
        done(item !== 'b');
      }, 10);
    }, function (notAborted, arr) {
      track('done', notAborted, arr);
      expect(order).to.be.eql(order, [
        'each', 'a', 0, arr,
        'each', 'b', 1, arr,
        'done', false, arr
      ], 'should call eachFn for each array item, in order, followed by doneFn.');
    });
  });

  it('Not actually asynchronous', function () {
    var arr = ['a', 'b', 'c'];
    forEach(arr, function (item, index, arr) {
      track('each', item, index, arr);
      var done = this.async();
      done();
    }, function (notAborted, arr) {
      track('done', notAborted, arr);
      expect(order).to.be.eql(order, [
        'each', 'a', 0, arr,
        'each', 'b', 1, arr,
        'each', 'c', 2, arr,
        'done', true, arr
      ], 'should call eachFn for each array item, in order, followed by doneFn.');
    });
  });

  it('Sparse array support', function () {
    var arr = [];
    arr[0] = 'a';
    arr[9] = 'z';

    forEach(arr, function (item, index, arr) {
      track('each', item, index, arr);
    });

    expect(order).to.be.eql(order, [
      'each', 'a', 0, arr,
      'each', 'z', 9, arr,
      'done', true, arr
    ], 'should skip nonexistent array items.');
  });

  it('Invalid length sanitization', function () {
    var obj = {length: 4294967299, 0: 'a', 2: 'b', 3: 'c'};

    forEach(obj, function (item, index, arr) {
      track('each', item, index, arr);
    });

    expect(order).to.be.eql(order, [
      'each', 'a', 0, obj,
      'each', 'b', 2, obj,
    ], 'should skip nonexistent array items.');
  });
});