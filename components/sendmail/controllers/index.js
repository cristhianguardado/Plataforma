var app = require("../../../app");
var User = require("../../users/models");
var Courses = require("../../courses/models");
var nodemailer = require("nodemailer");


exports = module.exports;


exports.getsendmail = function(req, res){
	 var query = User.find({});

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
					res.render('sendmail', {results: results, courses: courses, title: "Envio de correos"});	
				}
			})

		}
	});
}

exports.getsendmailmateria = function(req, res) {
  var materia = req.params.materia;
	User.find({materia: materia}, function(err, results) {
		if(err) {
			console.log(err);
			res.send(406, err)
		}
		if(!results){
			res.redirect('/sendmail');
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
						title: "Envio de correos",
						materia: materia
					}
					res.render('sendmail', render);	
				}
			})

		}
	});
}

exports.postenviocorreos = function(req, res){
	var body = req.body.mail;
	var titulo  = req.body.titulo;
	var materia = req.params.materia;
	console.log(materia);
	User.find({materia: materia}, function(err, results){
		if (err){
			console.log(err);
		}
		if(!results){
			res.redirect('/sendmail');
		}
		if(results){
			for(i=0; i <= results.length; i++ ){
				console.log(i);
				console.log("si pero no que pedo pasa aqui " + results[i].email);
				var smtpTransport = nodemailer.createTransport('SMTP',{
					service: 'Gmail',
					auth: {
					  user: "plataformafime@gmail.com",
					  pass: "Plataforma"
						}
			  });
			  var mailOptions = {
			    from: "Plataforma<plataformafime@gmail.com>", // sender address
					to: results[i].email,// list of receivers
					subject: titulo, // Subject line
					//text: "Hello world ✔" // plaintext body
					html: body // html body
			  }		    
			  smtpTransport.sendMail(mailOptions, function(error, response){
			    if(error){
			    	console.log(error);
				  	req.flash("error", "Correo electronico no se pudo enviar intentelo mas tarde");
				  	res.redirect("/sendmail");	
					}else{
						console.log(response)
				  	req.flash("envio", "Se envio correctamente el correo electronico");
				  	res.redirect("/sendmail");	
					}
				});	
			}
		}
	})
}

