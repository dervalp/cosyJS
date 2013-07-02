var _ = require("underscore"),
    gridFactory = require("../factory/grid"),
    merger = require("../../utils/merger"),
    PageBuilder = require("../structure/pageBuilder");

module.exports = {
    configure: function (app, _c, structures, data, layoutConfiguration, middlewares, controllers, options) {
        var pages = data || {},
            layoutCache = layoutConfiguration,
            middlewaresCache = middlewares,
            grid = gridFactory.create(options.grid);

        var getPage = function (currentRoute) {
            return _.find(pages, function (p) {
                var route = p.route;
                if (p.subdomain) {
                    route = "/" + p.subdomain + route;
                }
                return route === currentRoute;
            });
        };

        var getStructure = function (page) {
            return _.find(structures, function (struc) {
                return page.structure === struc.id;
            });
        };

        var getControllers = function (page) {
            var result = [];
            if (!_.isArray(page.controller)) {
                page.controller = [page.controller];
            }

            _.each(controllers, function (controller) {
                _.each(page.controller, function (pageController) {
                    if (controller[pageController]) {
                        result.push(controller[pageController]);
                    }
                });
            });

            return result;
        };

        var getLayout = function (page) {
            page.layout = page.layout || "layout";

            return layoutCache[page.layout + ".master"];
        };

        var setupComponents = function (components, req) {
            var scope = req.scope,
                all = req.all;

            _.each(components, function (comp) {
                comp.data = comp.data || {};

                if (comp.link) {
                    for (var key in comp.link) {
                        if (comp.link.hasOwnProperty(key)) {
                            comp.data[comp.link[key]] = scope[key];
                        }
                    }
                }

                if (all) {
                    comp.data.all = all;
                }
            });
        };

        var buildPage = function (req, res) {

            var page = getPage(req.route.path),
                structure = getStructure(page),
                layout = getLayout(page),
                controllers = getControllers(page);

            page.scope = req.scope || {};

            setupComponents(page.components, req);

            layout.scripts = page.scripts || [];

            var current = new PageBuilder(_c, grid, layout, page.components, structure, controllers, page.scope);

            current.initialized(req, function () {
                current.render(function (content) {
                    res.send(content);
                });
            });
        };

        _.each(pages, function (page) {
            var route = page.route;
            if (page.subdomain) {
                route = "/" + page.subdomain + route;
            }
            if (page.middlewares) {
                var middlewares = [];
                _.each(page.middlewares, function (middle) {
                    middlewares.push(middlewaresCache[middle]);
                });

                app.get(route, middlewares, buildPage);
            } else {
                app.get(route, buildPage);
            }
        });
    }
};