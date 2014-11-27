var include = require("includemvc");
var app = include.app();
var Users = require("../../users/models");
var Avisos = require("../../avisos/models");
var Activities = require("../../activities/models");

exports.home = function (req, res){
	var id = req.params.id;
	Users.find({_id: id }, function(err, user){
		if(err){
			res.send(err, 400);
		}
		if(user){
			Avisos.find({materia: user.materia}, function(error, avisos){
				if(error);
				res.send(error, 400);
				if(avisos){
					Activities.find({materia: user.materia}, function(erro, activities){
						if(erro){
							res.send(erro, 400),
						}
						if(activities){
							var render = {
								title: "Home",
								user: user,
								avisos: avisos,
								activities: activities,
							}
							res.render("home", render);
						}
					})
				}
			})
		}
	})	
}

exports.error403 = function(req, res){
	res.render("403");
}

exports.error404 = function(req, res){
	res.render("404");
}

exports.error = function (req, res){
	res.render("error");
}

