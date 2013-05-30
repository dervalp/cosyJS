var _ = require('underscore'),
    layoutBuilder = require('./layoutBuilder'),
    search = require("../../utils/search"),
    async = require("async"),
    gridBuilder = require('./gridBuilder');
/**
 * CTOR: create a new Page Object
 * @params {Object} - config is an object which has the parameters to create a Grid
 *                    {
 *                      grid: {Object},
 *                      layout: {String}
 *                    }
 * @params {Array} - array of Controls, should come from a database
 * @returns {Object}
 */
var Page = function(_c, config, componentsConfig, placeholder) {
    this.config = config || { };
    this.layout = this.config.layout || "base.master.jade";
    this.placeholder = placeholder || { };

    if(!this.config.grid) {
        this.grid = new gridBuilder();
    } else {
        this.grid = new gridBuilder(config.grid.prefixClass, config.grid.extraClass, config.grid.classForRow);
    }
    this.componentsConfig = componentsConfig;
    this.components = [];

    _.each(componentsConfig, function(component) {
        try {
            var Klass = _c.components[component.type];
            var data = _.extend(component, component.data);
            var model = new Klass.model(data);
            var view = new Klass.view({ model: model });

            var control = {
                model: model,
                view: view
            };

            this.components.push(control);    
        } catch(err) {
            throw "Component " + component.type + " does not exist";
        }
        
    }, this);
};

Page.prototype.getServerComponents = function() {
    return this.components;
};

Page.prototype.getFrontEndComponents = function() {
    return _.filter(this.components, function(component){
        return component.model.get("dynamic");
    });
};

var isDynamic = function(control) {
    return control.dynamic;
};

Page.prototype.buildDynamic = function() {
    var result = [];

    _.each(this.componentsConfig, function(control) {
        if(isDynamic(control)) {
            result.push(control);
        }
    });

    return JSON.stringify(result);
}

Page.prototype.build = function(cb)  {
    var self = this;
    layoutBuilder().on('ready', function(data) {
        var content, pageTemplate,
            serverSideComponents = self.getServerComponents(),
            clientSideConfiguration = self.buildDynamic();

        content =  self.grid.create(self.placeholder);

        pageTemplate = _.template(data[self.layout]())({ content: content, conf: self.buildDynamic() });

        renderComponents(pageTemplate, serverSideComponents, self.placeholder, cb);
    });
};
var renderArea = function(placeholder, components, cb) {
    var html = "",
        area = _.filter(components, function(component){ return component.model.get("placeholder") === placeholder; }).sort(function(a, b){ return a.model.get("order") < b.model.get("order"); });

    /*add async library here*/
    async.map(area, function(component, callback) {

        component.view.render(function(compHTML) {
            callback(null, compHTML);
        });

    }, function(err, result) {
        
        cb(result.join(""));
    });
};

var pluckPlaceholder = function(placeholders) {
    var result = [];

    search.dfs(placeholders, function(node){
        result.push(node.name);
    });

    return result;
};

var renderComponents = function(page, components, placeholders, cb) {
    var pageTemplate = _.template(page),
        templateValues = { root: "" };

    if(placeholders && _.keys(placeholders).length > 0) { 
        var pls = pluckPlaceholder(placeholders),
            objectForTemplate = {};

        async.map(pls, function(placeholder, cb) {
            renderArea(placeholder, components, function(html) {
                objectForTemplate[placeholder] = html;
                cb(undefined, html);
            });
        }, function(err, result) {
            var page = pageTemplate(objectForTemplate);
            cb(page);
        });
    } else {
        renderArea("root", components, function(result) {
            templateValues.root = result;
            var page = pageTemplate(templateValues);

            cb(page);
        });
    }
};

module.exports = Page;