var app = require("../../app");
var controller = require("./controllers");
var Model = require("./models");
var mongoose = require('mongoose');
var User = require("../users/models");

function isAdmin(req, res, next) {
  if (req.session.passport.user){    
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


//Obtener usuarios(admin)
app.get("/preusers", isAdmin, controller.getUsers);
//Registro de usuarios
app.get("/preregister", controller.getUserForm);
app.post("/preregister", controller.postNewUser);
//Eliminar usuario (admin)
app.post("/deletepreUser/:id", isAdmin, controller.deleteUser);
//Aceptar usuario (admin)
app.post("/aceptUser/:id", isAdmin, controller.aceptuser);