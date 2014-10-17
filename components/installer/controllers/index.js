var include = require("includemvc");
var mongoose = require("mongoose");
var fs = require("fs");
var path = require("path");
var Secure = require("../../../lib/secure");
var secure = new Secure();
var Model = include.model("users");


exports.getFirstUser = function(req, res) {
	res.render("firstuser", {
		title: "Crear el primer usuario"
	})
}

exports.postFirstUser = function(req, res) {
	var body = req.body;
	var password = req.body.password;
	var passwordconfi = req.body.passwordconfi;
	var email = req.body.email;
	if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
		if(password == passwordconfi) {
			var user = {
				email: email,
				fullName: body.fullName,
				matricula: body.matricula,
				materia: "profesor",
				equipo: 0,
				password: secure.encrypt(body.password),
				isAdmin: true,
				isUser: false
			}
			var model = new Model(user);
			model.save(function(err, result) {
				if(err) {
					console.log(err);
					req.flash("error", err);
					res.redirect("/install/firstuser");
				}
				if(result) {
					console.log(result);
					res.redirect("/install/finish");
				}
			})
		}else{
			res.redirect("/install/firstuser");
			req.flash("error", "Los password no coniciden");
		}
	}else{
		res.redirect("/install/firstuser");
		req.flash("error", "El email no es correcto");
	}
}

exports.getFinish = function(req, res) {
	var render = {
		title: "Felicidades",
	}
	res.render("finish", render);
	setTimeout(function() {
		console.log("Se a guardado su primer usuario. Por favor reinicia la aplicacion")
		process.exit();
	}, 2000);
}