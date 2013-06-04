var _                 = require("underscore"),
    path              = require("path"),
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
    layoutBuilder     = require("./core/structure/layoutBuilder"),
    scriptBuilder     = require("./core/structure/scriptBuilder"),
    structureBuilder  = fileCrawler(STRUCTURE_PATH),
    contentBuilder    = fileCrawler(CONTENT_PATH),
    applicationServer = require("./core/server/applicationServer"),
    builderServer     = require("./core/server/builderServer"),
    tmplEngine        = require("./core/template/helper"),
    staticServer      = require("./core/server/staticServer")(scriptBuilder);

_c.setEngine(tmplEngine);

module.exports = function(express, conf) {

    if(conf) { defaultConfiguration = _.extend(defaultConfiguration, conf); }

    return {
        configuration: defaultConfiguration,
        start: function(cb) {
            componentBuilder.build(_c, defaultConfiguration.component, function(_c, configuration) {

                staticServer.configure(express, configuration);

                structureBuilder.build(defaultConfiguration.structure, function(grids) {

                    contentBuilder.build(defaultConfiguration.page, function(pages) {
                        layoutBuilder.build(defaultConfiguration.layout, function(layouts) {
                            applicationServer.configure(express, _c, grids, pages, layouts, defaultConfiguration);
                            cb();
                        });
                    });
                });
            });
        }
    };
};