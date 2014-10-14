var mongoose = require('mongoose');

var Activity = mongoose.model('Activity',{
	name: String, 
	materia: String,
	explicacion: String,
	created: {type: Date, default: Date.now },
	deadline: Date
});

module.exports = Activity;