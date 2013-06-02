var configuration = {
      layoutFolder:      "./content/layouts/",
      cosyPrefix:        "cosy-",
      componentFolder:   "content/components/"
};

module.exports = function(app, conf) {
 
    var _c                = require("../clientLib/cosy"),
        componentBuilder  = require("./core/structure/componentBuilder")(configuration.componentFolder),
        scriptBuilder     = require("./core/structure/scriptBuilder"),
        applicationServer = require("./core/server/applicationServer"),
        builderServer     = require("./core/server/builderServer"),
        tmplEngine        = require("./core/template/helper"),
        staticServer      = require("./core/server/staticServer")(scriptBuilder);

    _c.setEngine(tmplEngine);
     
    //should be moved to other module
    var data = {};

    return {
        start: function(cb) {
            //TODO: should build external component
            componentBuilder.build(_c, function(_c, configuration) {
                staticServer.configure(app, configuration);
                applicationServer.configure(app, _c, data);
                cb();
            });
        }
    };
};