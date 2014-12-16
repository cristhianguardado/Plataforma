var include = require("includemvc");
var app = require("../../app");
var controller = require("./controllers");
var mongoose = require('mongoose');
var User = require("../users/models");


function isLogged(req, res, next) {
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
        else if(isUser == true){
          app.locals.isAdmin = false;
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


app.get("/", function(req, res){
  res.redirect('/login');
});

app.get("/serchuser", function(req, res){
  User.findOne({_id: req.session.passport.user}, function(err, result){
    if(err){
      console.log(err);
    }
    if(result){
      res.redirect('/home/' + result._id);
    }
  });
});


app.get("/403", controller.error403);
app.get("/404", controller.error404);
app.get("/error", controller.error);