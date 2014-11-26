'use strict';
var _ = require('lodash');
var expect = require('expect.js');

describe('Javascript memory allocation', function () {

  var Message = function (fields) {
    var self = this;
    fields.forEach(function (field) {
      self[field] = field;
    });

    this.print = function () {
      for (var i in self) {
        if (typeof self[i] !== 'function')
          console.log(self[i]);
      }
    };
  };
  Message.prototype = Object.create(Object.prototype);
  Message.prototype.constructor = Message;

  var SuperMessage = function (fields, param) {
    Message.call(this, fields);

    this[param] = param;
  };
  SuperMessage.prototype = Object.create(Message.prototype);
  SuperMessage.prototype.constructor = SuperMessage;


  it('Should be able to create Message instance', function () {
    var message = new Message(['field1', 'field2']);
    message.print();
    expect(message).to.be.ok();
  });

  it('Should be able to create Message instance', function () {
    var message = new SuperMessage(['field1', 'field2'], 'field3');
    message.print();
    expect(message).to.be.ok();
  });

  it('Testing code of ForEach', function () {
    var item = '';
    _.forEach(item, function () {
      expect().fail();
    });
  });

  it('Testing code of shifting postions', function () {
    expect(8 >> 1).to.be.eql(4);
    expect(8 << 1).to.be.eql(16);
  });

  //it.only('let vs var', function () {
  //  var a = 5;
  //  var b = 10;
  //
  //  if (a === 5) {
  //    let a = 4; // The scope is inside the if-block
  //    var b = 1; // The scope is inside the function
  //
  //    expect(a).to.be.eql(4);  // 4
  //    expect(b).to.be.eql(1);  // 1
  //  }
  //
  //  expect(a).to.be.eql(5);  // 5
  //  expect(b).to.be.eql(1);  // 1
  //});
});