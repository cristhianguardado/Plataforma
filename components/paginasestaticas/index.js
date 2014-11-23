var include = require("includemvc");
var app = require("../../app");
var controller = require("./controllers");
var mongoose = require('mongoose');
var User = require("../users/models");


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


app.get("/", function(req, res){
  res.redirect('/login');
});

app.get("/homepage", isLogged, controller.homepage)
app.get("/403", controller.error403);
app.get("/404", controller.error404);
app.get("/error", controller.error);