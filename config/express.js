/**
 * Module dependencies.
 */
var express = require('express'),
    session = require('express-session'),
    compression = require('compression'),
    favicon = require('serve-favicon'),
    serveStatic = require('serve-static'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    json = require('json-middleware'),
    mongoStore = require('connect-mongo')(session),
    flash = require('connect-flash'),
    helpers = require('view-helpers'),
    config = require('./config');

module.exports = function (app, passport, db) {
    app.set('showStackError', true);

    if (config.env === 'development') {
        app.locals.pretty = true;
    }

    //Should be placed before express.static
    app.use(compression({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    //Setting the fav icon and static folder
    app.use(favicon(config.root + '/public/img/icons/favicon.ico'));
    app.use(serveStatic(config.root + '/public'));

    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');

    //Enable jsonp
    app.enable('jsonp callback');

    //cookieParser should be above session
    app.use(cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(json.middleware());
    app.use(methodOverride());

    //express/mongo session storage
    app.use(session({
        secret: 'MEAN',
        saveUninitialized: true,
        resave: true,
        store: new mongoStore({
            db: db.connection.db,
            collection: 'sessions'
        })
    }));

    //connect flash for flash messages
    app.use(flash());

    //dynamic helpers
    app.use(helpers(config.app.name));

    //use passport session
    app.use(passport.initialize());
    app.use(passport.session());

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
