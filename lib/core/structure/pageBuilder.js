var _ = require("underscore"),
    search = require("../../utils/search"),
    tmplSystem = require("handlebars"),
    async = require("async"),
    gridBuilder = require("./gridBuilder");

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
var Page = function (_c, grid, layout, componentsConfig, placeholder, controllers) {
    this._c = _c;
    this.grid = grid;
    this.layout = layout;
    this.placeholder = placeholder || {};

    this.componentsConfig = componentsConfig || [];
    this.components = [];
    this.componentPlacholders = [];
    this.module = {};
    this.controllers = controllers || [];
    this.buildControls();
};

Page.prototype.initialized = function (done) {
    var module = this.module;
    if (this.controllers.length > 0) {
        async.map(this.controllers, function (controller, cb) {
            controller.apply(module, function (controllerDone) {
                cb(null, controllerDone);
            });
        }, function () {
            done();
        });
    } else {
        done();
    }
};

Page.prototype.buildControls = function () {
    _.each(this.componentsConfig, function (component) {
        try {
            var Komp = this._c.components[component.type],
                model,
                data = _.extend(component, {
                    isInstance: Komp.isInstance
                }),
                hasPlaceholder = (Komp.placeholders && Komp.placeholders.length > 0),
                initialdata = _.extend(data, component.data),
                template = component.client ? "insertion" : undefined;

            if (component.client) {
                Komp.view = this._c.View;
            }

            if (hasPlaceholder) {
                initialdata = _.extend(initialdata, {
                    placeholders: Komp.placeholders,
                    hasPlaceholder: true
                });
            }

            model = new Komp.model(initialdata);

            var control = {
                model: model,
                view: new Komp.view({
                    model: model,
                    template: template
                })
            };
            this.module[component.id] = model;
            this.components.push(control);

        } catch (err) {
            throw "Component " + component.type + " does not exist";
        }

    }, this);
};

var renderArea = function (placeholder, components, areaRendered) {
    var html = "",
        htmlIfPlaceholder = {},
        pls = [],
        index = 0,
        buildIndexedArea = [],
        buildIndex = function (component) {
            if (component.model.get("placeholder") === placeholder) {
                buildIndexedArea.push({
                    index: index,
                    component: component
                });
                index++;
            }
        },
        subPlaceHolder = function (area) {
            if (area.component.model.get("hasPlaceholder")) {
                pls.push({
                    index: area.index,
                    component: area.component
                });
            }
        };

    _.each(components, buildIndex);

    _.each(buildIndexedArea, subPlaceHolder);

    async.map(pls, function (area, subPlaceholderRendered) {

        area.component.view.render(function (subPlaceholderHtml) {

            var htmlToInsert = {},
                subPlaceTemplate = subPlaceholderHtml,
                placeholders = area.component.model.get("placeholders");

            async.map(placeholders, function (subPlaceholder, childRendered) {
                var fullName = area.component.model.get("id") + "." + subPlaceholder;

                renderArea(fullName, components, function (html) {
                    htmlToInsert[subPlaceholder] = html;
                    childRendered(undefined, html);
                });
            }, function (err) {
                var currentArea = _.find(buildIndexedArea, function (a) {
                    return a.index === area.index;
                });
                var data = _.extend(htmlToInsert, area.component.model.get("data"));
                currentArea.content = subPlaceTemplate(data);
                subPlaceholderRendered(null, html);
            });
        });
    }, function (err) {
        async.map(buildIndexedArea, function (area, callback) {
            if (!area.content) {
                area.component.view.render(function (compHTML) {
                    callback(null, compHTML);
                });
            } else {
                callback(null, area.content);
            }
        }, function (err, result) {
            areaRendered(result.join(""));
        });
    });
};

var pluckPlaceholder = function (placeholders) {
    var result = [];

    search.dfs(placeholders, function (node) {
        result.push(node.name);
    });

    return result;
};

var renderComponents = function (page, components, placeholders, cb) {
    var pageTemplate = tmplSystem.compile(page),
        templateValues = {
            content: ""
        };

    if (placeholders && _.keys(placeholders).length > 0) {
        var pls = pluckPlaceholder(placeholders),
            objectForTemplate = {};

        async.map(pls, function (placeholder, cb) {
            renderArea(placeholder, components, function (html) {
                objectForTemplate[placeholder] = html;
                cb(undefined, html);
            });
        }, function (err, result) {
            var page = pageTemplate(objectForTemplate);
            cb(page);
        });
    } else {
        renderArea("content", components, function (result) {
            templateValues.content = result;
            var page = pageTemplate(templateValues);

            cb(page);
        });
    }
};

Page.prototype.getServerComponents = function () {
    return _.filter(this.components, function (component) {
        return !component.model.get("onlydynamic");
    });
};

Page.prototype.getFrontEndComponents = function () {
    return _.filter(this.components, function (component) {
        return component.model.get("dynamic") || component.model.get("onlydynamic");
    });
};

var isDynamic = function (control) {
    return control.dynamic;
};

Page.prototype.buildDynamic = function () {
    var result = [];

    _.each(this.componentsConfig, function (control) {
        if (isDynamic(control)) {
            result.push(control);
        }
    });

    return JSON.stringify(result);
};

Page.prototype.buildScript = function () {
    var scripts = this.layout.scripts || [];
    return JSON.stringify(scripts);
};

Page.prototype.render = function (cb) {
    var self = this,
        content, pageTemplate,
        serverSideComponents = self.getServerComponents(),
        scriptConfiguration = self.buildScript(),
        clientSideConfiguration = self.buildDynamic();

    content = self.grid.create(self.placeholder);

    pageTemplate = tmplSystem.compile(self.layout.template)({
        content: content,
        conf: clientSideConfiguration,
        scripts: scriptConfiguration
    });

    renderComponents(pageTemplate, serverSideComponents, self.placeholder, cb);
};

module.exports = Page;