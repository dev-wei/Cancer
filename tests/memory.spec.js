'use strict';
var expect = require('expect.js');

describe('browserify-loader', function () {

  var Message = function (fields) {
    fields.forEach(function(field){
      this[field] = field;
    });
  };

  it('it can not be null', function () {

  });

});