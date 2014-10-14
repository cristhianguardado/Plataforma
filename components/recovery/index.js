var app = require("../../app");
var controller = require("./controllers");
var Model = require("./models");


app.get("/recoverpassword", controller.getRecover);
app.post("/recoverpassword", controller.postRecover);

app.get("/changepassword/:id", controller.getChangePassForm);
app.post("/changepassword/:id", controller.postChangePass);

//liks de prueba
app.get('/link', controller.getlink);
//app.get('/remove', controller.deletelink);