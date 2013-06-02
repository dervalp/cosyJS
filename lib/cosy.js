var configuration = {
      layoutFolder:      "./content/layouts/",
      cosyPrefix:        "cosy-"
    };

var _                 = require("underscore"),
    path              = require("path"),
    _c                = require("../clientLib/cosy"),
    STRUCTURE_PATH = path.normalize(__dirname + "../../../../content/structures/"),
    CONTENT_PATH = path.normalize(__dirname + "../../../../content/components/"),
    componentBuilder  = require("./core/structure/componentBuilder"),
    scriptBuilder     = require("./core/structure/scriptBuilder"),
    structureBuilder  = require("./utils/fileCrawler")(STRUCTURE_PATH),
    contentBuilder    = require("./utils/fileCrawler")(CONTENT_PATH),
    applicationServer = require("./core/server/applicationServer"),
    builderServer     = require("./core/server/builderServer"),
    tmplEngine        = require("./core/template/helper"),
    staticServer      = require("./core/server/staticServer")(scriptBuilder);

var defaultConfiguration = {
    componentFolder: process.cwd()
};

module.exports = function(app, conf) {

    if(conf) { defaultConfiguration = _.extend(defaultConfiguration, conf); }

    _c.setEngine(tmplEngine);
     
    return {
        start: function(cb) {
            componentBuilder.build(_c, defaultConfiguration.componentFolder, function(_c, configuration) {

                staticServer.configure(app, configuration);

                structureBuilder.build(function(structures) {
                    applicationServer.configure(app, _c, structures, data);
                    cb();
                });
            });
        }
    };
};