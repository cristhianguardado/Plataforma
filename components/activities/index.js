var app = require("../../app");
var controller = require("./controllers");
var Model = require("./models");
var mongoose = require('mongoose');
var User = require("../users/models");

function isUser(req, res, next) {
  if (req.isAuthenticated()){
    User.findOne({_id: req.session.passport.user}, function(err, result){
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
    User.findOne({_id: req.session.passport.user}, function(err, result){
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

//obtener actividad (user)
app.get('/activity/:id', isUser, controller.getactivity);
//obtener actividades (admin)
app.get('/activities', isAdmin, controller.getactivities);
//crear nueva actividad (admin)
app.get('/newactivity', isAdmin, controller.newactivity);
app.post('/newactivity', isAdmin, controller.postnewactivity);
//editar actividad (admin)
app.get('/editactivity/:id', isAdmin, controller.editactivity);
app.post('/editactivity/:id', isAdmin, controller.posteditactivity);
//eliminar actividad (admin)
app.post('/deleteactivity/:id', isAdmin, controller.deleteactivity);