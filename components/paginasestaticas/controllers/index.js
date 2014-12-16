var include = require("includemvc");
var app = include.app();
var Users = require("../../users/models");
var Avisos = require("../../avisos/models");
var Activities = require("../../activities/models");

exports.home = function (req, res){
	var id = req.params.id;
	console.log(id)
	Users.find({_id: id }, function(err, result){
		if(err){
			res.send(err, 400);
		}
		if(result){
			console.log(result)
			console.log(result.materia);
			Avisos.find({materia: result.materia}, function(error, avisos){
				if(error){
					res.send(error, 400);
				}
				if(avisos){
					console.log(avisos)
					Activities.find({materia: result.materia}, function(erro, activities){
						if(erro){
							res.send(erro, 400);
						}
						if(activities){
							console.log(activities)
							/*var render = {
								title: "Home",
								result: result,
								avisos: avisos,
								activities: activities,
							}
							console.log(render)*/
							res.render("home", {title: "Home", result: result});
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

