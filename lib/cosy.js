var configuration = {
      layoutFolder:      "./content/layouts/",
      cosyPrefix:        "cosy-",
      componentFolder:   "./content/components/"
};

module.exports = function(app, conf) {
 
    var _c                = require("../clientLib/cosy"),
        componentBuilder  = require("./core/structure/componentBuilder")(configuration.componentFolder),
        scriptBuilder     = require("./core/structure/scriptBuilder")(configuration.componentFolder),
        applicationServer = require("./core/server/applicationServer"),
        builderServer     = require("./core/server/builderServer"),
        tmplEngine        = require("./core/template/helper"),
        staticServer      = require("./core/server/staticServer")(scriptBuilder);

    staticServer.configure(app);    

    _c.setEngine(tmplEngine);
     
    //should be move to other module
    var data = {}, component = "list of component";

    return {
        start: function(cb) {
            //TODO: builder should build default component and custom
            componentBuilder.build(components, _c, function(_c) {
                applicationServer.configure(app, _c, data);
                builderServer.configure(app, _c, data);
                cb();
            });
        }
    };
};