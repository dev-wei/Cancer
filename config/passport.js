'use strict';
var LocalStrategy = require('passport-local').Strategy;
var User = require('mongoose').model('User');

module.exports = function (passport) {

  var serializeUser = function (user, done) {
    done(null, user.id);
  };

  var deserializeUser = function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -hashed_password', function (err, user) {
      done(err, user);
    });
  };

  var strategy = new LocalStrategy(
    function (email, password, done) {
      User.findOne({email: email},
        function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {message: 'Unknown user'});
          }
          if (!user.authenticate(password)) {
            return done(null, false, {message: 'Invalid password'});
          }
          return done(null, user);
        });
    });

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  passport.use(strategy);
};