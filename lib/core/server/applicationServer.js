var _ = require('underscore'),
    PageBuilder = require('../structure/pageBuilder');

module.exports = {
    configure: function(app, _c, data) {

      app.set('pages',  data.pages);

      var buildPage = function(req, res) {

        var page = _.find(app.get('pages'), function(p) { return p.route === req.route.path }),
            current = new PageBuilder(_c, { grid: data.EMPTYGRID, layout: page.layout + ".master.jade" }, page.components, data.basicStructure);

        current.build(function(content) { res.send(content); });
      };

      _.each(data.pages, function( page ) {
        app.get(page.route, buildPage);
      });
    }
}