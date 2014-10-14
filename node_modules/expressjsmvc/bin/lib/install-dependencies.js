var path = require("path")
var Git = require("git-wrapper2");
var git = new Git();
var colors = require("colors");
var fs = require('fs');
var exec = require('child_process').exec;
var npm = require("npm");

/** 
 * list directories 
 */
function listModules(directory, callback) {
	var results = fs.readdirSync(directory);
	return results;
}

/** 
 * check if the package.json file exists 
 */
function hasPackagefile(directory, callback) {
	return fs.readFile(directory + "/package.json", "utf-8", function(err, result) {
		if(err) {
			console.log("   no package.json found in %s, ommiting directory".yellow, directory);
		}
		return callback(err, result);
	});
}

/** 
 * Call npm install, read the package.json in the given directory
 * and call install for each dependency found
 */
function executeNPM(directory, callback) {
	hasPackagefile(directory, function(err, result) {
		if(result) {
			var pkg = JSON.parse(result);
			var dependencies = pkg.dependencies;			

			npm.load({}, function(err) {
				if(err) {
					console.log(err);
				}

				// Loop the dependencies property in the file
				Object.keys(dependencies).forEach(function(dependency) {
					npm.commands.install([dependency], function(er, data) {
						if(er) {
							return callback(er, null);
						}
						if(data) {
							return callback(null, data);
						}
					});
				})		
			});

		}
		else {
			return callback(null, null);
		}
	})
}

/** 
 * main exportable function 
 */
function installDependencies(directory, callback) {
	executeNPM(directory, function(err, result) {
		if(err) console.log(err + "".red);
		if(result) console.log(result + "".green);

		callback(err, result);
	})
}

module.exports = installDependencies;