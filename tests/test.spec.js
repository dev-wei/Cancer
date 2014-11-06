'use strict';
var expect = require('expect.js');

describe('Javascript memory allocation', function () {

  var Message = function (fields) {
    var self = this;
    fields.forEach(function (field) {
      self[field] = field;
    });

    this.print = function () {
      for(var i in self){
        if(typeof self[i] !== 'function')
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
});