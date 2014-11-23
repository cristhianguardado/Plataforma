var include = require("includemvc");
var app = include.app();
var Avisos = require("../../avisos/models");
var Users = require("../../users/models");

exports.homepage = function (req, res){
	Avisos.find({materia: general}, function(err, avisos){
		if(err){
			console.log(err);
		}
		if(avisos)
			res.send(avisos, 400);
			res.render("homepage", {title: "Home Page"});
	})
}

exports.error403 = function(req, res){
	res.render("403", { title: "Acceso denegado"});
}

exports.error404 = function(req, res){
	res.render("404", {title: "Pagina no encontrada"});
}

exports.error = function (req, res){
	res.render("error");
}

