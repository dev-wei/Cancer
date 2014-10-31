'use strict';
var expect = require('expect.js');

describe('browserify-loader', function () {

    var Message = function (fields) {
        var self = this;
        fields.forEach(function (field) {
            self[field] = field;
        });
    };

    Message.prototype = Object.create(Object.prototype);
    Message.prototype.constructor = Message;

    it('it can not be null', function () {
        var message = new Message(['field1']);
        console.log(message.a);
    });

});