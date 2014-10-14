var mongoose = require('mongoose');

var User = mongoose.model('User',{
	email: { type: String, index:{unique: true}},
	password: String,
	fullName: String,
	matricula: { type: String, index:{unique: true}},
	materia: String,
	equipo: Number,
	isAdmin: Boolean, 
	isUser: Boolean,
	created: {type: Date, default: Date.now }
});

module.exports = User;