# Install

  npm install includemvc

# How to use
Having a directory structure like this:

	- root
	---- app.js
	---- lib
	------ mylib.js
	---- modules
	------ mymodule
	-------- controllers
	---------- index.js
	-------- models
	---------- index.js
	-------- index.js

You can use any of the following methods to require your files

## Methods available

### include(module, type, file)

Example:

		var include = require("include");
		var mycontroller = include("mymodule", "controllers");

### include.controller(module)

Example:

		var include = require("include");
		var mycontroller = include.controller("mymodule");

### include.model(module)

Example

		var include = require("include");
		var mymodel = include.model("mymodule");

### include.root(file)

Example

		var include = require("include");
		var app = include.root("app");

### include.app()

Example

		var include = require("include");
		var app = include.app();

### include.lib(file);

Example

		var include = require("include");
		var mylib = include.lib("mylib");

### include.path(directory, file);

Example

		var include = require("include");
		var mylib = include.path("lib", "mylib");

## License
Released under the MIT License, see LICENSE for the full license
