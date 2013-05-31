/**
 * Builder Server will be used to output the appropriate pages
 */
var _ = require('underscore'),
    PageBuilder = require('../structure/pageBuilder');

var creatBuilder = function(lastNumber) {
  var builder = {
    name:     "builder",
    parent: "root",
    order: lastNumber
  };

  return builder;
};


var builderify = function(structure) {
  var builder = creatBuilder(structure.columns.length);

  structure.columns.push(builder);
};

var createBuilderComponent = function () {
  var builder =  [
    { type: "respmenu", direction: "west", id: "_c_nav", items: [ ], order:1 , placeholder: "builder" },
    { type: "respmenu", direction: "east", id: "_c_comp", items: [ ], order:2 , placeholder: "builder" },
    { type: "modal", id: "_c_modal", order:3 , placeholder: "builder" }
  ];

  return builder;
};

var builderifyComponent = function(components) {
  components.push(createBuilderComponent());

  return components;
};

module.exports = {
    configure: function(app, _c, data, prefix) {

      app.set('pages',  data.pages);

      var buildPage = function(req, res) {

        var page = _.find(app.get('pages'), function(p) { return p.route === req.route.path.split("/builder")[1] }),
            structure = builderifyStructure(data.basicStructure),
            components = builderifyComponent(page.components);

            current = new PageBuilder(_c, { grid: data.EMPTYGRID }, components, structure, prefix);

        current.build(function(content) { res.send(content); });
      };

      _.each(data.pages, function( page ) {
        app.get("/builder" + page.route, buildPage);
      });
    }
}