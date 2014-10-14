var path = require("path")
	, Git = require("git-wrapper2")
	, git = new Git()
	, colors = require("colors")
	, installDependencies = require("./install-dependencies")
  , fs = require('fs');

/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */
function emptyDirectory(path, fn) {
  fs.readdir(path, function(err, files){
    if (err && 'ENOENT' != err.code) throw err;
    fn(!files || !files.length);
  });
}

/** 
 * clone a project 
 * @param name string the namd of the directory to clone into inside the components directory
 * @param uri string the full URI of the repository
 */
function cloneProject(dir, uri) {
	emptyDirectory(dir, function(empty) {
		if(empty) {
			git.clone(uri, dir, function(err, repo) {

			});
		}
		else {
			console.log();
			console.log("   destination not empty : %s ".red, dir);
			console.log();
		}
	});
}

/** 
 * Check if a component did install or not 
 */
function checkIfComponentInstalled(dir, callback) {
	emptyDirectory(dir, function(empty) {
		callback(empty);
	})
}

/** 
 * main exportable function 
 */
function installComponents(callback) {
	process.on("exit", function() {
		console.log();
		console.log("   finished downloading all components, don't forget to enable them in config/config.json".green);
		console.log();
	})

	var expressjsmvc = fs.readFileSync("expressjsmvc.json", {encoding: "utf-8"});
	var file = JSON.parse(expressjsmvc);
	var components = file.components;
	
	// Define the base path
	var basepath = "components/";

	// loop the components property
	process.nextTick(function() {
		for(var name in components) {
			var dir = path.join(basepath, name);
			cloneProject(dir, components[name]);
		}
	});

	git.on("clone", function(repo, dir) {
		checkIfComponentInstalled(dir, function(empty) {
			// Retry if empty
			if(empty) {
				cloneProject(dir, repo);
			}
			else {
				console.log();
				console.log('   downloaded component : %s'.blue, repo);
				console.log();

				process.nextTick(function() {
					installDependencies(dir, function(err, result) {
						
					});
				})
			}
		})
	})
}

module.exports = installComponents;