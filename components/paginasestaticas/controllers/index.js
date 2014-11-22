var include = require("includemvc");
var app = include.app();

exports.homepage = function (req, res){
	res.render("homepage", {title: "Home Page"});
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

