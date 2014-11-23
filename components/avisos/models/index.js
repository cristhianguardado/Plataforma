var mongoose = require('mongoose');

var Aviso = mongoose.model('Aviso',{
	aviso: String,
	materia: String,
	created: {type: Date, default: Date.now }
});

module.exports = Aviso;