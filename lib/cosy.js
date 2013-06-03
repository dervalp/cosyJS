var _                 = require("underscore"),
    path              = require("path"),
    configuration = {
        layoutFolder:      "./content/layouts/",
        cosyPrefix:        "cosy-"
    },
    defaultConfiguration = {
        component   : path.normalize(process.cwd() + "/content/components/"),
        page        : path.normalize(process.cwd() + "/content/pages/"),
        structure   : path.normalize(process.cwd() + "/content/structures/"),
        layout      : path.normalize(process.cwd() + "/content/layouts/")
    },
    STRUCTURE_PATH    = path.normalize(__dirname + "../../../../content/structures/"),
    CONTENT_PATH      = path.normalize(__dirname + "../../../../content/pages/");

//cosy stuff
var _c                = require("../clientLib/cosy"),
    fileCrawler       = require("./utils/fileCrawler"),
    componentBuilder  = require("./core/structure/componentBuilder"),
    scriptBuilder     = require("./core/structure/scriptBuilder"),
    structureBuilder  = fileCrawler(STRUCTURE_PATH),
    contentBuilder    = fileCrawler(CONTENT_PATH),
    applicationServer = require("./core/server/applicationServer"),
    builderServer     = require("./core/server/builderServer"),
    tmplEngine        = require("./core/template/helper"),
    staticServer      = require("./core/server/staticServer")(scriptBuilder);

_c.setEngine(tmplEngine);

module.exports = function(app, conf) {

    if(conf) { defaultConfiguration = _.extend(defaultConfiguration, conf); }

    return {
        configuration: defaultConfiguration,
        start: function(cb) {
            componentBuilder.build(_c, defaultConfiguration.component, function(_c, configuration) {

                staticServer.configure(app, configuration);

                structureBuilder.build(defaultConfiguration.structure, function(structures) {

                    contentBuilder.build(defaultConfiguration.page, function(content){
                        
                        applicationServer.configure(app, _c, structures, content);
                        cb();
                    });
                });
            });
        }
    };
};