/**
 * @file exposes the app object instantiated so other components and files can
 * require it and share events across the entire application
 */

var express = require("express");
var include = require("includemvc");
var config = include.path("config", "config.json");
var app = module.exports = exports = express();
var path = require("path");
var mvc = require("expressjsmvc");
var flash = require("express-flash");
var CaminteStore = require("connect-caminte")(express);
var passport = require("passport")
  , LocalStrategy = require('passport-local').Strategy;
var stylus = require('stylus');
var nib = require('nib');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


// Alloy all configuration to be available in app.config
app.config = config;

// all environments
mvc.EnableMultipeViewsFolders(app);
app.set('port', process.env.PORT || 3000);
app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine', 'jade');
app.locals.basedir = path.join(__dirname, 'views');
app.locals.isAdmin = false;
app.locals.isLogged = false;
app.locals.session = false;
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));

//app.use(express.session({ cookie: { maxAge: 60000 }}));


app.use(express.session({  
	store: new CaminteStore({
		collection: "Sessions",
		blog: {
      driver     : "mongodb",
      host       : "localhost",
      port       : "27017",
      username   : "root",
      password   : "guardado",
      database   : "plataforma",
      clear_interval: 6000,
			maxAge: 60000
		}
  }),
		secret: config.secretKey,
		cookie: { maxAge: 86400000 }
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(app.router);
app.use(bodyParser());
app.use(methodOverride());
app.use(clientErrorHandler);
app.use(errorHandler);
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  next();
})

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
    console.log(str);
    console.log(path);
}

app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
))

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Algo salio mal' });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}
/** 
 * Autodetect all views in components 
 */
var components = config.components;
components.forEach(function(component) {
	mvc.addView(app, path.join(__dirname, "components", component));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}