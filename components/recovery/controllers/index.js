var app = require("../../../app");
var Model = require("../models");
var User = require("../../users/models")
var Secure = require("../../../lib/secure");
var secure = new Secure();
var nodemailer = require("nodemailer")


exports = module.exports;

exports.getRecover = function(req, res){
	res.render("recover", {title: "Recupera tu contaseña"})
}

exports.postRecover = function(req, res){
	var email = req.body.email;
	if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){
		User.findOne({email: email}, function(err, email){
			if (err){
				console.log(err);
			}
			if(!email){
				req.flash('error', 'Email no existe en la base de datos');
				res.redirect('/recoverpassword');
			}
			if(email){
				var recover = new Model ({
					status: false,
					user: email._id
				})
				recover.save(function(err, results){
					if(err){
						console.log(err);
					}
					if(results){
						console.log(results)
						var smtpTransport = nodemailer.createTransport('SMTP',{
							service: 'Gmail',
							auth: {
							  user: "estrada.cristhian9@gmail.com",
							  pass: "devilmycry"
								}
					  });
					  var mailOptions = {
					    from: "Plataforma<estrada.cristhian9@gmail.com>", // sender address
							to: email.email, // list of receivers
							subject: "Correo de recuperacion de contraseña", // Subject line
							//text: "Hello world ✔" // plaintext body
							html: "http://localhost:3000/changepassword/" + results._id // html body
					  }		    
					  smtpTransport.sendMail(mailOptions, function(error, response){
					    if(error){
						  	req.flash("error", "Correo electronico no se pudo enviar intentelo mas tarde");
						  	res.redirect("/recoverpassword");	
							}else{
						  	req.flash("envio", "Se envio correctamente el correo electronico de recuperacion favor de revisarlo");
						  	res.redirect("/recoverpassword");	
							}
					  });	
					}
				})
			}
		})
	}else {
		req.flash("error", "Correo electronico incorrecto");
		res.redirect("/recoverpassword");	
	}
}

exports.getChangePassForm = function(req, res){
	var today = new Date();
	var id = req.params.id;
	var query = Model.findOne({_id:id});
	if(req.query.limit && typeof req.query.limit !== undefined) {
		query = query.limit(req.query.limit);
	}
	else {
		query = query.limit(100);
	}
	query = query.sort({'_id': -1});
	query.exec(function(err, result) {
		if(err) {
			console.log(err);
			res.send(406, err)
		}
		if(result) {
			User.findOne({_id:result.user}, function(err, user){
				if(err){
					console.log(err);
				}
				if(!user){
					res.redirect("/404");
				}
				if(user){
					var status = result.status
					var deadline = result.created
					deadline.setHours(deadline.getHours()+24);
					if(today < deadline && status == false){
						res.render('chagepass', {result: result})
					}else{
						req.flash('error', 'El link de recuperacion ha expirado');
						res.redirect('/recoverpassword');
					}
				}
			})
		}
	});
}	


exports.postChangePass = function(req, res){
	var today = new Date();
	var id = req.params.id;
	var body = req.body;
	var pass = req.body.password;
	var passwordconfi = req.body.passwordconfi;
	
	var query = Model.findOne({_id:id});
	if(req.query.limit && typeof req.query.limit !== undefined) {
		query = query.limit(req.query.limit);
	}
	else {
		query = query.limit(100);
	}
	query = query.sort({'_id': -1});
	query.exec(function(err, result) {
		if(err) {
			console.log(err);
			res.send(406, err)
		}
		if(!result){
			res.redirect('/404');
		}
		if(result) {
			var status = result.status
			var deadline = result.created
			deadline.setHours(deadline.getHours()+24);
			if(today < deadline && status == false){
				User.findOne({_id: result.user}, function(err, user){
					if(err){
						console.log(err);
					}
					if(!user){
						res.redirect('/404');
					}
					if(user){
						if(pass == passwordconfi){
							console.log("user " + user);
							var user = { 
								password: secure.encrypt(body.password),
							};
							User.findOneAndUpdate({_id: result.user}, user, function(err, results){
								if(err){
									console.log(err);
								}
								if(results){
									console.log("update "+ results);
									Model.findOneAndUpdate({_id: id}, {status: true}, function(err, link){
										if(err){
											console.log(err);
										}
										if(link){
											console.log(link);
											res.redirect('/');
										}
									})
								}
							})
						}
						else{
							req.flash('error', 'Los password no coiciden');
							res.redirect('/changepassword/' + id);
						}					
					}
				})
			}
			else{
				req.flash('error', 'El link de recuperacion ha expirado');
				res.redirect('/recoverpassword');
			}
			
		}
	});
}					

exports.getlink = function(req, res){
	var today = new Date();
	var query = Model.find({});
	if(req.query.limit && typeof req.query.limit !== undefined) {
		query = query.limit(req.query.limit);
	}
	else {
		query = query.limit(100);
	}
	query = query.sort({'_id': -1});
	query.exec(function(err, result) {
		if(err) {
			console.log(err);
			res.send(406, err)
		}
		if(!result){
			res.redirect('/404')
		}
		if(result) {
			console.log(result);
		}
	});
}










// exports.deletelink = function(req, res){
// 	var today = new Date();
// 	var query = Model.find({});
// 	if(req.query.limit && typeof req.query.limit !== undefined) {
// 		query = query.limit(req.query.limit);
// 	}
// 	else {
// 		query = query.limit(100);
// 	}
// 	query = query.sort({'_id': -1});
// 	query.exec(function(err, result) {
// 		if(err) {
// 			console.log(err);
// 			res.send(406, err)
// 		}
// 		if(result){
// 			for (i=0; i<=result.length; i++){
// 				deadline = result[i].created;
// 				id = result[i]._id;
// 				//var status = result.status[i];
// 				//deadline.setHours(deadline.getHours()+24);
// 				console.log(id);
// 				console.log(deadline);
// 				if(today > deadline || status == true){
// 					Model.findOneAndRemove({_id: id}, function(err, results){
// 						if(err){
// 						}
// 						if(results){
// 							console.log(result);	
// 						}
// 					})
// 				}
// 			}
// 		}
// 	});
//}