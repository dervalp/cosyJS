var _ = require("underscore"),
    async = require("async"),
    merger = require("./utils/merger"),
    path = require("path"),
    defaultConfiguration = {
        component: path.normalize(process.cwd() + "/content/components/"),
        page: path.normalize(process.cwd() + "/content/pages/"),
        structure: path.normalize(process.cwd() + "/content/structures/"),
        layout: path.normalize(process.cwd() + "/content/layouts/"),
        middleware: path.normalize(process.cwd() + "/content/middlewares/"),
        controller: path.normalize(process.cwd() + "/content/controllers/")
    },
    STRUCTURE_PATH = path.normalize(__dirname + "../../../../content/structures/"),
    CONTENT_PATH = path.normalize(__dirname + "../../../../content/pages/");

//cosy stuff
var _c = require("../clientLib/cosy"),
    fileCrawler = require("./utils/fileCrawler"),
    componentBuilder = require("./core/structure/componentBuilder"),
    layoutBuilder = require("./core/structure/layoutBuilder"),
    scriptBuilder = require("./core/structure/scriptBuilder"),
    controllersBuilder = require("./core/structure/controllerBuilder"),
    structureBuilder = fileCrawler(STRUCTURE_PATH),
    contentBuilder = fileCrawler(CONTENT_PATH),
    applicationServer = require("./core/server/applicationServer"),
    middlewaresBuilder = require("./core/structure/middlewareBuilder"),
    staticServer = require("./core/server/staticServer")(scriptBuilder);

module.exports = function (express, configuration) {
    var conf = configuration || {};

    conf = _.extend(defaultConfiguration, conf);

    var tmplEngine = require("./core/template/helper")(conf.component),
        tmplExtension;

    _c.setEngine(tmplEngine, tmplExtension);

    if (configuration && configuration.templateExtension) {
        var tmplextPath = path.normalize(process.cwd() + "/" + configuration.templateExtension);

        require(tmplextPath)(_c.tmplSystem);
    }

    return {
        configuration: conf,
        start: function (done) {
            componentBuilder.build(_c, conf.component, function (_c, systemConfiguration, instanceConfiguration) {

                staticServer.configure(express, conf.component, systemConfiguration, instanceConfiguration);

                async.parallel({
                    grids: function (callback) {
                        structureBuilder.build(conf.structure, structureBuilder.parseJson, function (grids) {
                            callback(null, grids);
                        });
                    },
                    pages: function (callback) {
                        contentBuilder.build(conf.page, contentBuilder.parseJson, function (pages) {
                            pages = pages || [];
                            callback(null, pages);
                        });
                    },
                    layouts: function (callback) {
                        layoutBuilder.build(conf.layout, function (layouts) {
                            callback(null, layouts);
                        });
                    },
                    middlewares: function (callback) {
                        middlewaresBuilder.build(conf.middleware, function (middlewares) {
                            console.log(middlewares);
                            callback(null, middlewares);
                        });
                    },
                    controllers: function (callback) {
                        controllersBuilder.build(conf.controller, function (controllers) {
                            callback(null, controllers);
                        });
                    }
                },

                function (err, result) {
                    async.map(result.pages, function (page, cb) {
                        merger.extendPage(page, conf.page, function (extPage) {
                            cb(null, extPage);
                        });
                    }, function (error, pages) {
                        applicationServer.configure(express, _c, result.grids, pages, result.layouts, result.middlewares, result.controllers, conf, function (app) {
                            done(app);
                        });
                    });
                });

            });
        }
    };
};