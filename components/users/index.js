var app = require("../../app");
var controller = require("./controllers");
var Model = require("./models");
var Secure = require("../../lib/secure");
var secure = new Secure();
var mongoose = require('mongoose');
var passport = require("passport")
  , LocalStrategy = require('passport-local').Strategy;

<<<<<<< HEAD
/*function isUSer(req, res, next){
=======
function isLogged(req, res, next){
>>>>>>> manejo_sesion
  if(!req.session.passport.user){
    res.redirect("/login");
    next();
  }else{
<<<<<<< HEAD
    next();
  }
};*/

function isUser(req, res, next) {
  if (req.session.passport.user){
    Model.findOne({_id: req.session.passport.user}, function(err, result){
      if(err){
        console.log(err);
      }
      if(result){
        console.log(req.isAuthenticated);
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
=======
    app.locals.isLogged = true;
    app.locals.session = req.session.passport.user;
    next();
>>>>>>> manejo_sesion
  }
};

function isAdmin(req, res, next) {
  if (req.session.passport.user){    
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

<<<<<<< HEAD
function isLogged(req, res, next){
  if(!req.session.passport.user){
    res.redirect("/login");
    next();
  }else{
    app.locals.isLogged = true;
    app.locals.session = req.session.passport.user;
    next();
  }
};
=======
>>>>>>> manejo_sesion


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

//obtener usuario
app.get("/user/:id",isLogged, controller.getUser);//user and admin

app.get("/users", isLogged, controller.getUsers);//admin
app.get("/users/:materia", isAdmin, controller.getUsersformateria);//admin

//Eliminar usuario (admin)
app.post("/deleteUser/:id", isAdmin, controller.deleteUser);

//Editar usuario (usuarios)
app.get("/editUser/:id", isLogged, controller.getEditForm);
app.post("/editUser/:id", isLogged, controller.postEditUser);

//Editar usuarios (admin)
app.get("/editUserAdmin/:id", isAdmin, controller.getEditFormAdmin);
app.post("/editUserAdmin/:id", isAdmin, controller.postEditUserAdmin);

app.get("/login", controller.getLogin);
<<<<<<< HEAD
app.post("/login", 
=======
app.post("/login",
>>>>>>> manejo_sesion
  passport.authenticate('local', { 
    successRedirect: '/users',
    failureRedirect: '/login',
    failureFlash: true })
);

app.get("/logout", controller.getLogout);