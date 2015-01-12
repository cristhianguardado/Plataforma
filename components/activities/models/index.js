var mongoose = require('mongoose');

var Activity = mongoose.model('Activity',{
	name: String, 
	materia: String,
	explicacion: String,
	image: {
		imageName: String,
		imagePath: String,
		imageType: String
	},
	created: {type: Date, default: Date.now },
	deadline: Date,
});

module.exports = Activity;