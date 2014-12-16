var app = require("../../../app");
var Model = require("../models");
var Materias = require("../../courses/models");

exports = module.exports;

function getaviso(req, res) {  
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

exports.getavisos = function(req, res) {
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
			res.render('avisos', {results: results, title:"Avisos"});
		}
	});
}

exports.newaviso = function(req, res){
	Materias.find(function(err, result){
		if(err){
			console.log(err);
		}
		if(result){
			res.render('nuevoaviso', {title: "Agregar nuevo aviso", result: result});	
		}
	})
}

exports.postnewaviso = function(req, res) {
	var body = req.body;
	var aviso = new Model({ 
		aviso: body.aviso,
		materia: body.materia
	});
	aviso.save(function (err, result) {
		if(err) {
		}
		if(result) {
			res.redirect('/avisos');			
		}
	});
};

exports.editaviso = function(req, res){
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
					console(error);
				}
				if(materias){
					res.render('editaravisos',{title: "Editar informacion del curso", result: result, materias: materias});
				}
			})
		}
	});
};

exports.posteditaviso = function(req, res) {
	var id = req.params.id;
	var body = req.body;
	var aviso = new Model({ 
		aviso: body.aviso,
		materia: body.materia
	});
	Model.findOneAndUpdate({_id: id}, aviso, function(err, result){
		if(err) {
			console.log(err)
		}
		if(result) {
			res.redirect('/avisos');			
		}
	});
};

exports.deleteaviso = function(req,res){
	var id = req.params.id;
	Model.findOneAndRemove({_id: id}, function(err, result) {
		if(err) {
			res.send(406, err);
		}
		if(result) {
			res.redirect('/avisos');
		}
	});
};
