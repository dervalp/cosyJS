var _ = require("underscore"),
    path = require("path"),
    defaultConfiguration = {
        component: path.normalize(process.cwd() + "/content/components/"),
        page: path.normalize(process.cwd() + "/content/pages/"),
        structure: path.normalize(process.cwd() + "/content/structures/"),
        layout: path.normalize(process.cwd() + "/content/layouts/")
    },
    STRUCTURE_PATH = path.normalize(__dirname + "../../../../content/structures/"),
    CONTENT_PATH = path.normalize(__dirname + "../../../../content/pages/");

//cosy stuff
var _c = require("../clientLib/cosy"),
    fileCrawler = require("./utils/fileCrawler"),
    componentBuilder = require("./core/structure/componentBuilder"),
    layoutBuilder = require("./core/structure/layoutBuilder"),
    scriptBuilder = require("./core/structure/scriptBuilder"),
    structureBuilder = fileCrawler(STRUCTURE_PATH),
    contentBuilder = fileCrawler(CONTENT_PATH),
    applicationServer = require("./core/server/applicationServer"),
    builderServer = require("./core/server/builderServer"),
    staticServer = require("./core/server/staticServer")(scriptBuilder);


module.exports = function (express, configuration) {
    var conf = configuration || {};

    conf = _.extend(defaultConfiguration, conf);

    var tmplEngine = require("./core/template/helper")(conf.component);

    _c.setEngine(tmplEngine);

    return {
        configuration: conf,
        start: function (cb) {
            componentBuilder.build(_c, conf.component, function (_c, systemConfiguration, instanceConfiguration) {

                staticServer.configure(express, conf.component, systemConfiguration, instanceConfiguration);

                structureBuilder.build(conf.structure, function (grids) {

                    contentBuilder.build(conf.page, function (pages) {
                        layoutBuilder.build(conf.layout, function (layouts) {
                            applicationServer.configure(express, _c, grids, pages, layouts, conf);
                            cb();
                        });
                    });
                });
            });
        }
    };
};