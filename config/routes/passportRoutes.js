'use strict';
var express = require('express');
var router = express.Router();
var passportCtrl = require('../../app/controllers/passport');

module.exports = function (passport) {
  router.post('/session',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: false
    }), passportCtrl.session);

  return router;
};
