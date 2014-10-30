var include = require("includemvc");
var app = include.app();

exports.frontpage = function(req, res) {
	var session = req.session.passport.user;
	res.render("frontpage", { title: "Plataforma"});
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
