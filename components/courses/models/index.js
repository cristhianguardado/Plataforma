var mongoose = require('mongoose');

var Materia = mongoose.model('Materia',{
	name: {type: String, index:{unique: true}},
	created: {type: Date, default: Date.now }
});

module.exports = Materia;