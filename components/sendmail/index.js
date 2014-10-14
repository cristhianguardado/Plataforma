var app = require("../../app");
var controller = require("./controllers");
var User = require("../users/models");

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

//rutas solo para admin
app.get("/sendmail", controller.getsendmail);
app.get("/sendmail/:materia", controller.getsendmailmateria);
app.post("/sendmail/:materia", controller.postenviocorreos);