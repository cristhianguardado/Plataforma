var app = require("../../../app");
var Model = require("../models");
var User = require("../../users/models");
var Secure = require("../../../lib/secure");
var secure = new Secure();
var Materias = require("../../courses/models");

exports = module.exports;

//Registro de usuario
exports.getUserForm = function(req, res){
	Materias.find(function(err, result){
		if(err){
			console.log(err);
		}
		if(result){
			console.log(result);
			res.render('register', {title: "Realiza tu Pre-Registro", result:result});	
		}
	})
}

//Registro de usuario
exports.postNewUser = function(req, res) {
	var body = req.body;
	var email = req.body.email;
	var password = req.body.password;
	var passwordconfi = req.body.passwordconfi;
	console.log(body.materia);
	if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
		if(password == passwordconfi){
			var user = new Model({ 
				email: email,
				fullName: body.fullName,
				matricula: body.matricula,
				password: secure.encrypt(body.password),
				materia: body.materia,
				isUser: true,
				isAdmin: false
			});
			console.log(user)
			user.save(function (err, result) {
				if(err) {
					console.log(err);
					req.flash("error", "Email ya existe");
					res.redirect('/preregister');
				}
				if(result) {
					req.flash("success", "Felicidades has quedado registrado");
					res.redirect('/');			
				}
			});
		}else{
			req.flash('error', 'Los password no coniciden');
			res.redirect('/preregister');
		}
	}else{
		req.flash('error', 'Email no valido');
		res.redirect('/preregister');	
	}
};

//Obtener usuarios
exports.getUsers = function(req, res) {
  var query = Model.find({});
	if(req.query.limit && typeof req.query.limit !== undefined) {
		query = query.limit(req.query.limit);
	}
	else {
		query = query.limit(100);
	}
	query = query.sort({'_id': -1});
	query.exec(function(err, results) {
		if(err) {
			console.log(err);
			res.send(406, err)
		}
		if(results) {
			console.log(results);
			res.render('preusers', {results: results});
		}
	});
}

//Eliminar usuario
exports.deleteUser = function(req,res){
	var id = req.params.id;
	Model.findOneAndRemove({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result) {
			res.redirect("/preusers");
		}
	});
};

//Aceptar usuario 
exports.aceptuser = function (req, res) {
	var id = req.params.id;
	console.log(id);
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){	
			var user =  new User({ 
				created: result.created,
				email: result.email,
				fullName: result.fullName,
				materia: result.materia,
				matricula: result.matricula,
				password: result.password,
				isUser: true,
				isAdmin: false
			});		
			user.save(function (err, results) {
				if(err) {
					req.flash("error", "Usuario con el email: "+ result.email + " o con la contraseña: "+ result.matricula +" ya esta registrado");
					res.redirect('/preusers');
				}
				if(results) {
					Model.findOneAndRemove({_id: id}, function(err, result) {
						if(err) {
							res.send(406, err);
						}
						if(result) {
							res.redirect("/preusers");
						}
					});	
				}
			});
		}
	});
}