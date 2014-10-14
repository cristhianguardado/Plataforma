var app = require("../../../app");
var Model = require("../models");
var Secure = require("../../../lib/secure");
var secure = new Secure();
var Courses = require("../../courses/models");

exports = module.exports;

//Obtener usuario
exports.getUser = function(req, res) {  
  var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){
			res.render('user',{result: result, title: result.fullName});
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
						title: "Usuarios"
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
						title: "Usuarios de la materia" + materia
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
			console.log(result)
			res.render('editUser',{title: "Editar informacion", result: result});
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
				password: secure.encrypt(body.password),
				user: true,
				admin: false
			};
			console.log(user)
			Model.findOneAndUpdate({_id: id}, user, function(err, result){
				if(err) {
					req.flash('error', 'Usuario con el correo electronico: ' + email + 'ya existe');
					res.redirect('/editUser/' + id);
				}
				if(result) {
					res.redirect('/user/' + result._id);			
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
			console.log(result)
			res.render('editUserAdmin',{title: "Editar informacion de:" , result: result});
		}
	});
};

//Editar usuario (admin)
exports.postEditUserAdmin = function(req, res) {
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
			console.log(user)
			Model.findOneAndUpdate({_id: id}, user, function(err, result){
				if(err) {
					req.flash('error', 'Usuario con el correo electronico: ' + email + 'ya existe');
					res.redirect('/editUserAdmin/' + id);
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

exports.getLogin = function(req, res) {
  res.render("login" , {title: "Log in"});
}

exports.postLogin = function(req, res) {
  Model.findOne({_id: id}, function(err, result) {
  	if (err){
  		console.log(err)
  	}
  	if(result){
  		console.log("que pedo")
  		passport.authenticate("local", {
    		successRedirect: "/user/" + result._id,
    		failureRedirect: "/login",
    		failureFlash: true
  		});
  	}
  });
}

exports.getLogout = function(req, res) {
  req.logout();
  app.locals.isAdmin = false;
  app.locals.isUser = false;
  app.locals.isLogged = false;
  res.redirect("/login");
}