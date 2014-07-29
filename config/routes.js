var express = require('express');

module.exports = function(app, passport, auth) {

    //Home route
    var router = express.Router(),
        index = require('../app/controllers/index');
    router.get('/', index.render);

    //User Routes
    var users = require('../app/controllers/users');
    router.get('/signin', users.signin);
    router.get('/signup', users.signup);
    router.get('/signout', users.signout);
    router.get('/users/me', users.me);
    router.get('/users', users.all);

    router.post('/user', users.create);
    router.post('/user/update', users.updateUser);

    //Setting the local strategy route
    router.post('/user/session', passport.authenticate('local', {
        failureRedirect: '/signin',
        failureFlash: true
    }), users.session);

    //Finish with setting up the userId param
    router.param('userId', users.user);

    var test = require('../app/controllers/test');
    router.get('/tests/:name', test.render);

    app.use('/', router);


    //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        //Treat as 404
        if (~err.message.indexOf('not found')) return next();

        //Log it
        console.error(err.stack);

        //Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    //Assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });



};