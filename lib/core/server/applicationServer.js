var _ = require('underscore'),
    PageBuilder = require('../structure/pageBuilder');

module.exports = {
    configure: function(app, _c, structures, data) {
      var pages = data.pages || {},
          structures = structures;

      var buildPage = function(req, res) {
        
        page.layout = page.layout || "layout";

        var structure = structures[page.structure],
            page = _.find(pages, function(p) { return p.route === req.route.path }),          
            current = new PageBuilder(_c,
                                      { 
                                        grid: data.EMPTYGRID,
                                        layout: page.layout + ".master.jade"
                                      },
                                      page.components,
                                      structure);

        current.build(function(content) { res.send(content); });
      };

      _.each(data.pages, function( page ) {
        app.get(page.route, buildPage);
      });
    }
};