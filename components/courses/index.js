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


//obtener cursos (admin)
app.get('/courses', isAdmin, controller.getcourses);
//crear nuevo curso (admin)
app.get('/newcourse', isAdmin, controller.newcourse);
app.post('/newcourse', isAdmin, controller.postnewcourse);
//editar curso (admin)
app.get('/editcourse/:id', isAdmin, controller.editcourse);
app.post('/editcourse/:id', isAdmin, controller.posteditcourse);
//eliminar cursos (admin)
app.post('/deletecourse/:id', isAdmin, controller.deletecourse);