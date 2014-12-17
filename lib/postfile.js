var include = require("includemvc");
var app = include.app();
var fs = require("fs");

function postPicture(image) {
	var self = this;
}

postPicture.prototype.postPicture = function(image) {
	if(!image.name) {
		var picture = {
			imagePath: '/images/applications/default.jpg',
			imageType: 'image/jpg',
			imageName: 'default.jpg'
		}
		return picture;
	}
	else {
		var path = __dirname.split('/');
		path.splice(path.length - 1);
		var homePath = path.join('/') + '/';
		//var homePath ='C:/Sites/cse/';
		var newPath = '/images/applications/'+image.name;
		fs.readFile(homePath+image.path, function (err, data) {
			if(err) {
				console.log("No se encuentra la imagen...");
			}
			if(data) {
			  fs.writeFile(homePath+'public'+newPath, data, function(err) {
			  	if(err) {
			  		console.log("No se puede escribir la imagen...");
			  	}
			  });
				fs.unlink(image.path);
			}
		});

		var picture = {
			imagePath: newPath,
			imageType: image.type,
			imageName: image.name
		}
		return picture;
	}
};

postPicture.prototype.editPicture = function(image, body) {
	if(!image.name) {
		var picture = {
			imagePath: body.oldimage[1],
			imageType: body.oldimage[2],
			imageName: body.oldimage[0]
		}
		return picture;
	}
	else {
		var path = __dirname.split('/');
		path.splice(path.length - 1);
		var homePath = path.join('/') + '/';
		//var homePath ='C:/Sites/cse/';
		var newPath = '/images/applications/'+image.name;
		fs.readFile(homePath+image.path, function (err, data) {
			if(err) {
				console.log("No se encuentra la imagen...");
			}
			if(data) {
			  fs.writeFile(homePath+'public'+newPath, data, function(err) {
			  	if(err) {
			  		console.log("No se puede escribir la imagen...");
			  	}
			  });
				fs.unlink(image.path);
			}
		});
		var picture = {
			imagePath: newPath,
			imageType: image.type,
			imageName: image.name
		};
		return picture;
	}
};

module.exports = postPicture;