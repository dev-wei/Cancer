/**
 * Module dependencies.
 */
var path = require('path'),
    session = require('express-session'),
    compression = require('compression'),
    favicon = require('serve-favicon'),
    logger = require("morgan"),
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

    //Set views path, template engine and default layout
    app.set('views', path.join(config.root, '/app/views'));
    app.set('view engine', 'jade');

    //Setting the fav icon and static folder
    app.use(favicon(path.join(config.root, '/public/img/icons/favicon.ico')));
    app.use(serveStatic(path.join(config.root, '/public')));

    //Enable jsonp
    app.enable('jsonp callback');

    //cookieParser should be above session
    app.use(cookieParser());

    //request body parsing middleware should be above methodOverride
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    //Enable logger
    app.use(logger('dev'));

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
};
