var mongoose = require('mongoose');

var User = mongoose.model('User',{
	email: { type: String, index:{unique: true}},
	password: String,
	fullName: String,
	matricula: { type: String, index:{unique: true}},
	materia: String,
	equipo: Number,
	calificacion1: Number,
	calificacion2: Number,
	calificacion3: Number,
	calificacion4: Number,
	calificacion5: Number,
	calmediocurso: Number,
	calfinal: Number,
	isAdmin: Boolean, 
	isUser: Boolean,
	created: {type: Date, default: Date.now }
});

module.exports = User;