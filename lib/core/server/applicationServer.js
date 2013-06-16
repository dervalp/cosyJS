var _ = require("underscore"),
    gridFactory = require("../factory/grid"),
    PageBuilder = require("../structure/pageBuilder");

module.exports = {
    configure: function (app, _c, structures, data, layoutConfiguration, middlewares, options) {
        var pages = data || {},
            layoutCache = layoutConfiguration,
            middlewaresCache = middlewares,
            grid = gridFactory.create(options.grid);

        var buildPage = function (req, res) {

            var page = _.find(pages, function (p) {
                return p.route === req.route.path;
            }),
                structure = _.find(structures, function (struc) {
                    return page.structure === struc.id;
                });

            page.layout = page.layout || "layout",
            layout = layoutCache[page.layout + ".master"];
            layout.scripts = page.scripts || [];


            var current = new PageBuilder(_c,
                grid,
                layout,
                page.components,
                structure);

            current.render(function (content) {
                res.send(content);
            });
        };

        _.each(pages, function (page) {
            if (page.middlewares) {
                var middlewares = [];
                _.each(middlewares, function (middle) {
                    middlewares.push(middlewaresCache[middle]);
                });
                app.get(page.route, middlewares, buildPage);
            } else {
                app.get(page.route, buildPage);
            }
        });
    }
};