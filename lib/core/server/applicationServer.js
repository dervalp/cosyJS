var _ = require('underscore'),
    PageBuilder = require('../structure/pageBuilder');

module.exports = {
    configure: function(app, _c, structures, data, layoutConfiguration) {

      var pages = data || {},
          structures = structures,
          layoutCache = layoutConfiguration;

      var buildPage = function(req, res) {

        var page = _.find(pages, function(p) { return p.route === req.route.path }),
            structure = _.find(structures, function(struc){ return page.structure == struc.id });

        page.layout = page.layout || "layout",
        layout = layoutCache[page.layout + ".master"];

        var current = new PageBuilder(_c,
                                      { 
                                        grid: data.EMPTYGRID,
                                        layout: layout
                                      },
                                      page.components,
                                      structure);

        current.render(function(content) { res.send(content); });
      };

      _.each(pages, function( page ) {
        var page = page;
        app.get(page.route, buildPage);
      });
    }
};