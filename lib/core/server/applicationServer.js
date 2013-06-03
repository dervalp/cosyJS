var _ = require('underscore'),
    PageBuilder = require('../structure/pageBuilder');

module.exports = {
    configure: function(app, _c, structures, data, layoutConfiguration) {

      var pages = data || {},
          structures = structures,
          layoutCache = layoutConfiguration;

      var buildPage = function(req, res) {

        var page = _.find(pages, function(p) { return p.route === req.route.path }),
            structure = structures[page.structure];

        page.layout = page.layout || "layout",
        layout = layoutCache[page.layout];

        var current = new PageBuilder(_c,
                                      { 
                                        grid: data.EMPTYGRID,
                                        layout: layout
                                      },
                                      page.components,
                                      structure);

        current.build(function(content) { res.send(content); });
      };

      _.each(pages, function( page ) {
        var page = page;
        app.get(page.route, buildPage);
      });
    }
};