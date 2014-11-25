var app = require("../../../app");
var Model = require("../models");
var Materias = require("../../courses/models");

exports = module.exports;

//Obtener actividad
exports.getactivity = function(req, res) {  
  var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result){
			res.render('activity', {result: result, title: result.name});
		}
	});
};

//Obtener todas la actividades
exports.getactivities = function(req, res) {
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
			res.render('activities', {results: results, title: "Actividades"});
		}
	});
}

//Registro de actividad
exports.newactivity = function(req, res){
	Materias.find(function(err, result){
		if(err){
			console.log(err);
		}
		if(result){
			res.render('newact', {title: "Registra una nueva actividad", result: result});	
		}
	});
}

//Registro de actividad
exports.postnewactivity = function(req, res) {
	var body = req.body;
	var activity = new Model({ 
		name: body.name,
		materia: body.materia,
		explicacion: body.explicacion,
		deadline: body.deadline	
	});
	activity.save(function (err, result) {
		if(err) {
			res.send(err);
		}
		if(result) {
			res.redirect('/activities');			
		}
	});
};

//Editar actividad
exports.editactivity = function(req, res){
		var id = req.params.id;
	Model.findOne({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(!result){
			res.redirect('/404');
		}
		if(result){	
			Materias.find(function(error, materias){
				if(error){
					console.log(error);
				}
				if(materias){
					res.render('editactivity',{title: "Editar actividad", result: result, materias: materias});
				}
			})
		}
	});
};

//Editar actividad
exports.posteditactivity = function(req, res) {
	var id = req.params.id;
	var body = req.body;
	var activity = { 
		name: body.name,
		materia: body.materia,
		explicacion: body.explicacion,
		deadline: body.deadline
	};
	Model.findOneAndUpdate({_id: id}, activity, function(err, result){
		if(err) {
			console.log(err)
		}
		if(result) {
			res.redirect('/activities');			
		}
	});
};

//Eliminar actividades
exports.deleteactivity = function(req,res){
	var id = req.params.id;
	Model.findOneAndRemove({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result) {
			res.redirect('/activities');
		}
	});
};
