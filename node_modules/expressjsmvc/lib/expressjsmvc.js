var path = require("path");
var mvc = exports = module.exports;

/** 
 * Enable having multiple folders for views to support the
 * module/mymodule/views structure 
 */
mvc.EnableMultipeViewsFolders = function(app) {
  // Monkey-patch express to accept multiple paths for looking up views.
  // this path may change depending on your setup.
  var lookup_proxy = app.settings.view.prototype.lookup;

  app.settings.view.prototype.lookup = function(viewName) {
    var context, match;
    if (this.root instanceof Array) {
      for (var i = 0; i < this.root.length; i++) {
        context = {root: this.root[i]};
        match = lookup_proxy.call(context, viewName);
        if (match) {
          return match;
        }
      }
      return null;
    }
    return lookup_proxy.call(this, viewName);
  };
}

/** 
 * Add a view to express so it's enabled 
 */
mvc.addView = function(app, directory) {
	var views = app.settings.views;
	var currentView = path.join(directory, 'views');
	views.push(currentView);
	app.set('views', views);
}