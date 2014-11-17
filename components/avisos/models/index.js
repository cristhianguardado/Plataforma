var mongoose = require('mongoose');

var Aviso = mongoose.model('Aviso',{
	description: String,
	materia: String,
	created: {type: Date, default: Date.now }
});

module.exports = Aviso;