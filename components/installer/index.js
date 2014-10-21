var include = require("includemvc");
var controller = include.controller("installer");
var app = include.app();
//var firstUserExists = include.lib("firstUserExists");
var Model = include.model("users");

function firstUser(req, res, next) {	
	Model.find(function(err, result) {
		if(err) {
			return res.redirect("/403");
		}

		if(result.length > 0) {
			console.log("hello" + result);
			return res.redirect("/403");
		}

		if(result.length == 0) {
			console.log(result);
			return next();
		}
	});
}

app.get("/install", function(req, res) {
	res.redirect("/install/firstuser");
});

app.get("/install/firstuser", firstUser, controller.getFirstUser);
app.post("/install/firstuser", firstUser, controller.postFirstUser);
app.get("/install/finish", controller.getFinish);