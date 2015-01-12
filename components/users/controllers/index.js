var app = require("../../../app");
var Model = require("../models");
var Secure = require("../../../lib/secure");
var secure = new Secure();
var Courses = require("../../courses/models");
var Avisos = require("../../avisos/models");
var Activities = require("../../activities/models");
var PostPicture= require("../../../lib/postPicture");
var postPicture = new PostPicture();

exports = module.exports;

exports.homepage = function (req, res){
	var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){
			var materia = result.materia
			Avisos.find({materia: materia}, function(error, avisos){
				if(error){
					console.log(error);
				}	
				if(avisos){
					Activities.find({materia:materia}, function(err, activities){
						if(err){
							console.log(err);
						}
						if(activities){
							var render = {
								result: result,
								avisos: avisos, 
								activities: activities,
								name: result.fullName,
								title: "Mi perfil"
							}
							res.render('homepage', render);
						}
					})
				}
			})
		}
	});
};

//Obtener usuario
exports.getUser = function(req, res) {  
  var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){
			var render = {
				result: result, 
				name: result.fullName,
				title: "Mi perfil"
			}
			res.render('perfil', render);
		}
	});
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
			Courses.find(function(err, courses){
				if(err){
					console.log(err);
				}
				if(courses){
					var render = {
						results: results, 
						courses: courses,
						title: "Administracion de Usuarios"
					}
					res.render('users', render);	
				}
			})

		}
	});
}
//buscar usuarios por materia
exports.getUsersformateria = function(req, res) {
  var materia = req.params.materia;
  console.log(materia);
  var query = Model.find({materia: materia});

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
			Courses.find(function(err, courses){
				if(err){
					console.log(err);
				}
				if(courses){
					var render = {
						results: results, 
						courses: courses, 
						title: "Usuarios de la materia " + materia
					}
					res.render('users', render);	
				}
			})

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
			res.redirect('/users');
		}
	});
};

//Editar usuario (usuario)
exports.getEditForm = function(req, res){
	var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){
			var render = {
				title: "Editar informacion de: ", 
				result: result
			}
			res.render('editUser', render);
		}
	});
};

//Editar usuario (usuario)
exports.postEditUser = function(req, res) {
	var id = req.params.id;
	var body = req.body;
	var email = req.body.email;
	var password = req.body.password;
	var passwordconfi = req.body.passwordconfi;
	if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
		if(password == passwordconfi){
			var user = { 
				email: body.email,
				fullName: body.fullName,
				matricula: body.matricula,
				materia: body.materia,
				password: secure.encrypt(body.password),
				user: true,
				admin: false
			};
			console.log(user)
			Model.findOneAndUpdate({_id: id}, user, function(err, result){
				if(err) {
					//req.flash('error', 'Usuario con el correo electronico: ' + email + 'ya existe');
					//res.redirect('/editUser/' + id);
				}
				if(result) {
					res.redirect('/perfil/' + result._id);			
				}
			});
		}else{
			req.flash('error', 'Los password no coniciden');
			res.redirect('/editUser/' + id);
		}
	}else{
		req.flash('error', 'Email no valido');
		res.redirect('/editUser/' + id);	
	}
};

//Editar usuario (admin)
exports.getEditFormAdmin = function(req, res){
	var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){
			Courses.find(function(err, courses){
				if(err){
					console.log(err);
				}
				if(courses){
					var password = secure.decrypt(result.password);
					var render = {
						title: "Editar informacion de: ", 
						result: result, 
						courses: courses,
						password: password
					}
					res.render('editUserAdmin', render);
				}

			})
		}
	});
};

//Editar usuario (admin)
exports.postEditUserAdmin = function(req, res) {
	console.log(req.body.materia)
	var id = req.params.id;
	var body = req.body;
	var email = req.body.email;
	var password = req.body.password;
	var passwordconfi = req.body.passwordconfi;
	if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
		if(password == passwordconfi){
			var user = { 
				email: body.email,
				fullName: body.fullName,
				matricula: body.matricula,
				materia: body.materia,
				equipo: body.equipo,
				password: secure.encrypt(body.password),
				user: true,
				admin: false
			};
			Model.findOneAndUpdate({_id: id}, user, function(err, result){
				if(err) {
					console.log(err);
					//req.flash('error', 'Usuario con el correo electronico: ' + email + 'ya existe');
					//res.redirect('/editUserAdmin/' + id);
				}
				if(result) {
					res.redirect('/users');			
				}
			});
		}else{
			req.flash('error', 'Los password no coniciden');
			res.redirect('/editUserAdmin/' + id);
		}
	}else{
		req.flash('error', 'Email no valido');
		res.redirect('/editUserAdmin/' + id);	
	}
};

//Editar calificaciones (admin)
exports.postgrades = function(req, res) {
	var id = req.params.id;
	var body = req.body;
	var user = { 
		calificacion1: body.calificacion1,
		calificacion2: body.calificacion2,
		calificacion3: body.calificacion3,
		calificacion4: body.calificacion4,
		calificacion5: body.calificacion5,
		calmediocurso: body.calmediocurso,
		calfinal:body.calfinal
	};
	Model.findOneAndUpdate({_id: id}, user, function(err, result){
		if(err) {
			console.log(err);
		}
		if(result) {
			res.redirect('/users');			
		}
	});
};

exports.getLogin = function(req, res) {
  res.render("login" , {title: "Log in"});
}

// exports.postLogin = function(req, res) {
//   Model.findOne({_id: id}, function(err, result) {
//   	if (err){
//   		console.log(err)
//   	}
//   	if(result){
//   		console.log("que pedo")
//   		passport.authenticate("local", {
//     		successRedirect: "/user/" + result._id,
//     		failureRedirect: "/login",
//     		failureFlash: true
//   		});
//   	}
//   });
// }

exports.getLogout = function(req, res) {
  req.logout();
  app.locals.isAdmin = false;
  app.locals.isUser = false;
  app.locals.isLogged = false;
  res.redirect("/");
}