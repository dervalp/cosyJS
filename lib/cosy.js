var configuration = {
  layoutFolder : "./content/layouts/",
  cosyPrefix: "cosy-",
  templatePath: "./content/templates/",
  componentFolder: "./content/components/"
};

//decide where to put the data
var data = {};

//should fetch all the component in the structure and in the folder of the instance
var components = ["text", "image", "menu", "button",  "collapse"];

module.exports = function(app, conf) {
  
  /**
   * Cosy's modules
   */
  var _c = require("../clientLib/cosy"),
      scriptBuilder = require('./core/structure/scriptBuilder'),
      applicationServer = require("./core/server/applicationServer"),
      staticServer = require("./core/server/staticServer"),
      builderServer = require("./core/server/builderServer"),
      tmplEngine = require("./core/template/helper"),
      componentBuilder = require("./core/structure/componentBuilder")(conf);

  staticServer.configure(app);

  _c.setEngine(tmplEngine);

  /*should be move to other module*/
  return {
    static: function(path) {
      /*where to find component*/
      conf.path = path;
    };
    start: function(cb) {
      //TODO: builder should build default component and custom
      componentBuilder.build(components, _c, function(_c) {
        applicationServer.configure(app, _c, data);
        builderServer.configure(app, _c, data);
        cb();
      });
    }
  }
}