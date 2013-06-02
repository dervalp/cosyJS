var configuration = {
      layoutFolder:      "./content/layouts/",
      cosyPrefix:        "cosy-"
};

var _                 = require("underscore"),
    _c                = require("../clientLib/cosy"),
    componentBuilder  = require("./core/structure/componentBuilder"),
    scriptBuilder     = require("./core/structure/scriptBuilder"),
    applicationServer = require("./core/server/applicationServer"),
    builderServer     = require("./core/server/builderServer"),
    tmplEngine        = require("./core/template/helper"),
    staticServer      = require("./core/server/staticServer")(scriptBuilder);

var defaultConfiguration = {
    componentFolder: process.cwd()
};

module.exports = function(app, conf) {

    if(conf) {
        defaultConfiguration = _.extend(defaultConfiguration, conf);
    }

    _c.setEngine(tmplEngine);
     
    return {
        start: function(cb) {
            
            //TODO: should build external component
            componentBuilder.build(_c, defaultConfiguration.componentFolder, function(_c, configuration) {
                staticServer.configure(app, configuration);
                applicationServer.configure(app, _c, data);
                cb();
            });
        }
    };
};