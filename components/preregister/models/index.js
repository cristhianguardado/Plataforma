var mongoose = require('mongoose');

var preUser = mongoose.model('Preregistro',{
	email: {
		type: String, 
		unique: true
	},
	password: String,
	fullName: String,
	matricula: {
		type: String, 
		unique: true
	},
	materia: String,
	equipo: Number,
	isAdmin: Boolean, 
	isUser: Boolean,
	created: {type: Date, default: Date.now }
});

module.exports = preUser;