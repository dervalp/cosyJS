var _               = require('underscore'),
    search          = require("../../utils/search"),
    async           = require("async"),
    gridBuilder     = require('./gridBuilder');
/**
 * CTOR: create a new Page Object
 * @params {Object} - config is an object which has the parameters to create a Grid
 *                    {
 *                      grid: {Object}, //only grid is required
 *                      layout: {String} //layout is required
 *                    }
 * @params {Array} - array of Controls, should come from a database
 * @returns {Object}
 */
var Page = function(_c, grid, layout, componentsConfig, placeholder) {
    
    this.grid = grid;
    this.layout = layout;
    this.placeholder = placeholder || { };
    
    this.componentsConfig = componentsConfig || [];
    this.components = [];

    _.each(componentsConfig, function(component) {
        try {
            var Komp = _c.components[component.type],
                data = _.extend(component, { isInstance: Komp.isInstance }),
                initialdata = _.extend(data, component.data),
                model = new Komp.model(initialdata),
                template = component.client ? "insertion" : undefined;
                if(component.client) {
                    Komp.view = _c.View    
                }
    
            var control = {
                model: model,
                view: new Komp.view({ model: model, template: template })
            };

            this.components.push(control);    
        } catch(err) {
            throw "Component " + component.type + " does not exist";
        }
        
    }, this);
};

Page.prototype.getServerComponents = function() {
    return _.filter(this.components, function(component){
        return !component.model.get("onlydynamic");
    });
};

Page.prototype.getFrontEndComponents = function() {
    return _.filter(this.components, function(component){
        return component.model.get("dynamic") || component.model.get("onlydynamic");
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

Page.prototype.buildScript = function() {
    var scripts = this.layout.scripts || [];
    return JSON.stringify(scripts);
};

Page.prototype.render = function(cb)  {
    var self = this, content, pageTemplate,
        serverSideComponents = self.getServerComponents(),
        scriptConfiguration = self.buildScript(),
        clientSideConfiguration = self.buildDynamic();

    content = self.grid.create(self.placeholder);

    pageTemplate = _.template(self.layout.template())({ content: content, conf: clientSideConfiguration, scripts: scriptConfiguration });

    renderComponents(pageTemplate, serverSideComponents, self.placeholder, cb);  
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
