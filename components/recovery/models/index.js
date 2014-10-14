var mongoose = require('mongoose');

var Recover = mongoose.model('Recover',{
	status: Boolean,
	created: {type: Date, default: Date.now },
	user: {type: mongoose.Schema.ObjectId, ref: 'User'} 
});

module.exports = Recover;