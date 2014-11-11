/**
 * Module dependencies.
 */
var path = require('path'),
  session = require('express-session'),
  compression = require('compression'),
  favicon = require('serve-favicon'),
  morgan = require('morgan'),
  serveStatic = require('serve-static'),
  cookieParser = require('cookie-parser'),
//methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
//json = require('json-middleware'),
  MongoStore = require('connect-mongo')(session),
  helpers = require('view-helpers'),
  config = require('./config');

module.exports = function (app, passport) {
  if (!app) {
    app = require('express')();
  }

  if (!passport) {
    passport = require('passport');
  }

  app.set('showStackError', true);

  if (config.env !== 'prod') {
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
  app.use(morgan('dev'));

  //express/mongo session storage
  var sessionConfig = {
    secret: 'Cancer',
    saveUninitialized: true,
    resave: true,
    cookie: {maxAge: config.cookieAge}
  };

  if (config.env === 'prod') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
    sessionConfig.store = new MongoStore({
      db: config.db,
      collection: 'sessions'
    });
  }

  app.use(session(sessionConfig));

  //dynamic helpers
  app.use(helpers(config.app.name));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });

  return app;
};
