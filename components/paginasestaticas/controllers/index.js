var app = require("../../../app");


exports.error403 = function(req, res){
	res.render("403", {title:"Permission denied X("});
}

exports.error404 = function(req, res){
	res.render("404", {title: "Page Not Found :("});
}

exports.error = function (req, res){
	res.render("error");
}

