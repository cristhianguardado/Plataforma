var include = require("includemvc");
var include = require("includemvc");
var app = include.app();
var controller = require("./controllers");

app.get("/", controller.frontpage);
app.get("/403", controller.error403);
app.get("/404", controller.error404);
app.get("/error", controller.error);