var app = require("../../app");
var controller = require("./controllers");
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

//rutas solo para admin
app.get("/sendmail", isAdmin, controller.getsendmail);
app.get("/sendmail/:materia", isAdmin, controller.getsendmailmateria);
app.post("/sendmail", isAdmin, controller.postenviocorreos);