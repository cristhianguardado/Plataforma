var app = require("../../../app");
var Model = require("../models");

exports = module.exports;

//Obtener Materia
function getcourse(req, res) {  
  var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){
			return result;
		}
	});
};

//Obtener todas las materias
exports.getcourses = function(req, res) {
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
			res.render('cursos', {results: results});
		}
	});
}

//Registro de materia
exports.newcourse = function(req, res){
	res.render('newcurso', {title: "Registra un nuevo curso"});	
}

//Registro de materia
exports.postnewcourse = function(req, res) {
	var body = req.body;
	var curso = new Model({ 
		name: body.name,
	});
	curso.save(function (err, result) {
		if(err) {
		}
		if(result) {
			res.redirect('/courses');			
		}
	});
};

//Editar materia
exports.editcourse = function(req, res){
	var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(!result){
			res.redirect('/404');
		}
		if(result){
			res.render('editcurso',{title: "Editar informacion del curso", result: result});
		}
	});
};

//Editar materia
exports.posteditcourse = function(req, res) {
	var id = req.params.id;
	var body = req.body;
	var curso = { 
		name: body.name,
	};
	Model.findOneAndUpdate({_id: id}, curso, function(err, result){
		if(err) {
			console.log(err)
		}
		if(result) {
			res.redirect('/courses');			
		}
	});
};

//Eliminar materia
exports.deletecourse = function(req,res){
	var id = req.params.id;
	Model.findOneAndRemove({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result) {
			res.redirect('/courses');
		}
	});
};
