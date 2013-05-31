var configuration = {
  layoutFolder : "./content/layouts/",
  cosyPrefix: "cosy-",
  templatePath: "./content/templates/",
  componentFolder: "./content/components/"
};

module.exports = function(app, conf) {
  /**
   * Configuration's module, should come from database
   */
  var conf = require("./conf"),
      testingData = require("./data"),
      conf = {
        components: "",
        layout: "",
        pages: "",
        path: ""
      };

  /**
   * Cosy's modules
   */
  var _c = require("./clientLib/cosy"),
      scriptBuilder = require('./core/structure/scriptBuilder'),
      applicationServer = require("./core/server/applicationServer"),
      staticServer = require("./core/server/staticServer"),
      builderServer = require("./core/server/builderServer"),
      tmplEngine = require("./core/template/helper"),
      componentBuilder = require("./core/structure/componentBuilder")(conf);

  staticServer.configure(app);

  _c.setEngine(tmplEngine);

  /* should come from database or internal memory */
  var components = ["text", "image", "menu", "button",  "collapse"];

  /*should be move to other module*/
  return {
    static: function(path) {
      /*where to find component*/
      conf.path = path;
    };
    start: function(cb) {
      //TODO: builder should build default component and custom
      componentBuilder.build(components, _c, function(_c) {
        applicationServer.configure(app, _c, testingData);
        builderServer.configure(app, _c, testingData);
        cb();
      });
    }
  }
}