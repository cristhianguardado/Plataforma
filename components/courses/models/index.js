var mongoose = require('mongoose');

var Materia = mongoose.model('Materia',{
	name: String,
	created: {type: Date, default: Date.now }
});

module.exports = Materia;