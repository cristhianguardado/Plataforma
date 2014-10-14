var app = require("../../app");
var controller = require("./controllers");
var Model = require("./models");
var Secure = require("../../lib/secure");
var secure = new Secure();
var mongoose = require('mongoose');
var passport = require("passport")
  , LocalStrategy = require('passport-local').Strategy;

function isUser(req, res, next) {
  if (req.isAuthenticated()){
    Model.findOne({_id: req.session.passport.user}, function(err, result){
      if(err){
        console.log(err);
      }
      if(result){
        var isAdmin = result.isAdmin;
        var isUser = result.isUse;
        if(isUser == true){
          app.locals.isAdmin = false;
          app.locals.isUser = true;
          app.locals.isLogged = true;
          app.locals.session = req.session.passport.user;
          next();
        }
        else{
          res.redirect("/403");
          next();
        }
      }
    })
  }
  else{
    res.redirect('/login');
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated()){    
    Model.findOne({_id: req.session.passport.user}, function(err, result){
      if(err){
        console.log(err);
      }
      if(result){
        var isAdmin = result.isAdmin;
        var isUser = result.isUser;
        if(isAdmin == true){
          app.locals.isAdmin = true;
          app.locals.isUser = false;
          app.locals.isLogged = true;
          app.locals.session = req.session.passport.user;
          next(); 
        }
        else{
          res.redirect("/403");
          next();
        }
      }
    })
  }
  else{
    res.redirect('/login');
  }
}

function isLogged(req, res, next){
  if(!req.session.passport.user){
    res.redirect("/login");
    next();
  }else{
    next();
  }
};


function validPassword(password, user){
  return secure.isEqual(password, user.password);
};

passport.use(new LocalStrategy(
  function(email, password, next) {
    console.log("Finding a user with email: " + email);
    Model.findOne({email: email}, function(err, user) {
      if (err) { 
        console.log(err);
        return next(err); 
      }
      if (!user) {
        return next(null, false, {
          message: 'Email incorrecto.' 
        });
      }
      if (!validPassword(password, user)) {
        return next(null, false, {
          message: 'Password incorrecto' 
        });
      }
      return next(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  Model.findById(id, function(err, user){
    done(null, user);
  });
});

//obtener usuarios
app.get("/user/:id",isLogged, controller.getUser);//user and admin

app.get("/users", isAdmin, controller.getUsers);//admin
app.get("/users/:materia", isAdmin, controller.getUsersformateria);//admin

//Eliminar usuario (admin)
app.post("/deleteUser/:id", isAdmin, controller.deleteUser);

//Editar usuario (usuarios)
app.get("/editUser/:id", isUser, controller.getEditForm);
app.post("/editUser/:id", isUser, controller.postEditUser);

//Editar usuarios (admin)
app.get("/editUserAdmin/:id", isAdmin, controller.getEditFormAdmin);
app.post("/editUserAdmin/:id", isAdmin, controller.postEditUserAdmin);

app.get("/login", controller.getLogin);
app.post("/login", controller.postLogin);
/*
  passport.authenticate('local', { 
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true })
);*/

app.get("/logout", controller.getLogout);