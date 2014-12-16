var app = require("../../../app");


exports.error403 = function(req, res){
	res.render("403");
}

exports.error404 = function(req, res){
	res.render("404");
}

exports.error = function (req, res){
	res.render("error");
}

