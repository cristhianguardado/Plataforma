var mongoose = require('mongoose');

var User = mongoose.model('User',{
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

module.exports = User;