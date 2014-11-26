'use strict';
var express = require('express');
var router = express.Router();

var index = require('../app/controllers/index');
router.get('/', index.getDefault);

//User Routes
//var users = require('../app/controllers/users');
//router.get('/signin', users.signin);
//router.get('/signup', users.signup);
//router.get('/signout', users.signout);
//router.get('/users/me', users.me);
//router.get('/users', users.all);

//router.post('/user', users.create);
//router.post('/user/update', users.updateUser);

//Setting the local strategy route
//router.post('/user/session',
//  passport.authenticate('local', {
//    failureRedirect: '/signin',
//    failureFlash: true
//}), users.session);

//Finish with setting up the userId param
//router.param('userId', users.user);

var test = require('../app/controllers/test');
router.get('/tests/:name', test.test);

module.exports = router;
